<template>
  <div class="review-detail-page">
    <n-spin :show="loading">
      <div v-if="manuscript" class="detail-container">
        <n-card :bordered="false" class="main-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <h1 class="title">{{ manuscript.title }}</h1>
                <n-tag type="warning" size="large">待审</n-tag>
              </div>
              <n-button @click="goBack">
                <template #icon>
                  <n-icon><ArrowBackOutline /></n-icon>
                </template>
                返回列表
              </n-button>
            </div>
          </template>

          <div class="author-info">
            <n-descriptions :column="2" bordered size="small">
              <n-descriptions-item label="作者">
                <n-space>
                  <n-avatar size="small">
                    {{ manuscript.author?.username?.charAt(0)?.toUpperCase() }}
                  </n-avatar>
                  <span>{{ manuscript.author?.username }}</span>
                </n-space>
              </n-descriptions-item>
              <n-descriptions-item label="邮箱">
                {{ manuscript.author?.email }}
              </n-descriptions-item>
              <n-descriptions-item label="提交时间">
                {{ formatDate(manuscript.submittedAt) }}
              </n-descriptions-item>
              <n-descriptions-item label="标签">
                <n-space wrap>
                  <n-tag
                    v-for="tag in manuscript.tags"
                    :key="tag"
                    type="info"
                    size="small"
                  >
                    {{ tag }}
                  </n-tag>
                </n-space>
              </n-descriptions-item>
            </n-descriptions>
          </div>

          <div class="content-section">
            <n-tabs v-model:value="activeTab" type="line">
              <n-tab-pane name="content" tab="稿件内容">
                <div class="section">
                  <h3 class="section-title">摘要</h3>
                  <p class="abstract">{{ manuscript.abstract }}</p>
                </div>
                <div class="section">
                  <h3 class="section-title">正文</h3>
                  <MarkdownViewer :content="manuscript.content" />
                </div>
              </n-tab-pane>
            </n-tabs>
          </div>
        </n-card>

        <n-card title="审稿意见" :bordered="false" class="review-card">
          <n-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-placement="top"
          >
            <n-form-item label="评分" path="rating">
              <n-rate v-model:value="formData.rating" :count="5" size="large" />
              <span class="rating-text">{{ formData.rating }} 星</span>
            </n-form-item>
            <n-form-item label="审稿意见" path="comment">
              <div class="markdown-editor-wrapper">
                <v-md-editor
                  v-model="formData.comment"
                  height="300px"
                  placeholder="请输入审稿意见，支持Markdown格式..."
                />
              </div>
            </n-form-item>
            <n-form-item>
              <n-space>
                <n-button
                  type="primary"
                  size="large"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  提交审核
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NButton, NIcon, NTag, NSpace, NAvatar, NDescriptions, NDescriptionsItem, NTabs, NTabPane, NForm, NFormItem, NRate, NSpin, useMessage, useDialog } from 'naive-ui'
import { ArrowBackOutline } from '@vicons/ionicons5'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getManuscript, reviewManuscript } from '@/api/manuscript'
import type { Manuscript, ReviewRequest } from '@/types'
import type { FormRules } from 'naive-ui'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()

const loading = ref(false)
const submitting = ref(false)
const manuscript = ref<Manuscript | null>(null)
const activeTab = ref('content')
const formRef = ref()

const formData = reactive<Omit<ReviewRequest, 'manuscriptId'>>({
  rating: 3,
  comment: ''
})

const rules: FormRules = {
  rating: [
    { required: true, message: '请进行评分', trigger: 'change' },
    { type: 'number', min: 1, max: 5, message: '评分范围1-5星', trigger: 'change' }
  ],
  comment: [
    { required: true, message: '请输入审稿意见', trigger: 'blur' },
    { min: 10, message: '审稿意见不少于10个字', trigger: 'blur' }
  ]
}

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function goBack() {
  router.push('/editor/review')
}

async function fetchManuscript() {
  const id = Number(route.params.id)
  if (!id) return
  
  loading.value = true
  try {
    manuscript.value = await getManuscript(id)
  } catch (e) {
    console.error('获取稿件失败:', e)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    
    dialog.warning({
      title: '确认提交',
      content: '提交审核后将提交给主编进行终审，确认提交吗？',
      positiveText: '确认提交',
      negativeText: '取消',
      onPositiveClick: async () => {
        const id = Number(route.params.id)
        submitting.value = true
        try {
          await reviewManuscript({
            manuscriptId: id,
            rating: formData.rating,
            comment: formData.comment
          })
          message.success('审核提交成功')
          router.push('/editor/review')
        } catch (e: any) {
          message.error(e.message || '提交失败')
        } finally {
          submitting.value = false
        }
      }
    })
  } catch (e) {
    console.log('验证失败')
  }
}

onMounted(() => {
  fetchManuscript()
})
</script>

<style scoped>
.review-detail-page {
  max-width: 1000px;
  margin: 0 auto;
}

.main-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
  flex: 1;
}

.author-info {
  margin: 24px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.content-section {
  margin-bottom: 24px;
}

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff;
  display: inline-block;
}

.abstract {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  color: #666;
  line-height: 1.8;
  font-size: 15px;
  margin: 0;
}

.review-card {
  margin-bottom: 24px;
}

.rating-text {
  margin-left: 12px;
  font-size: 16px;
  color: #666;
}

.markdown-editor-wrapper {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.v-md-editor) {
  border: none;
}

:deep(.n-tabs) {
  margin-top: 16px;
}
</style>
