<template>
  <div class="decision-detail-page">
    <n-spin :show="loading">
      <div v-if="manuscript" class="detail-container">
        <n-card :bordered="false" class="main-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <h1 class="title">{{ manuscript.title }}</h1>
                <n-tag type="info" size="large">审核中</n-tag>
              </div>
              <n-button @click="goBack">
                <template #icon>
                  <n-icon><ArrowBackOutline /></n-icon>
                </template>
                返回列表
              </n-button>
            </div>
          </template>

          <div class="review-info">
            <n-descriptions title="编辑审核信息" :column="2" bordered size="small">
              <n-descriptions-item label="编辑评分">
                <n-rate :value="manuscript.editorRating || 0" readonly size="small" />
                <span class="rating-text">{{ manuscript.editorRating || 0 }} 星</span>
              </n-descriptions-item>
              <n-descriptions-item label="审核编辑">
                {{ manuscript.editor?.username || '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="审核时间" :span="2">
                {{ manuscript.reviewedAt ? formatDate(manuscript.reviewedAt) : '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="编辑意见" :span="2">
                <div class="comment-content">
                  <MarkdownViewer :content="manuscript.editorComment || '暂无编辑意见'" />
                </div>
              </n-descriptions-item>
            </n-descriptions>
          </div>

          <div class="author-info">
            <n-descriptions title="作者信息" :column="2" bordered size="small">
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
              <n-descriptions-item label="提交时间" :span="2">
                {{ formatDate(manuscript.submittedAt) }}
              </n-descriptions-item>
              <n-descriptions-item label="标签" :span="2">
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

        <n-card title="终审决策" :bordered="false" class="decision-card">
          <n-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-placement="top"
          >
            <n-form-item label="决策" path="decision">
              <n-radio-group v-model:value="formData.decision">
                <n-space size="large">
                  <n-radio value="accepted">
                    <template #icon>
                      <n-icon color="#18a058"><CheckmarkCircleOutline /></n-icon>
                    </template>
                    录用
                  </n-radio>
                  <n-radio value="rejected">
                    <template #icon>
                      <n-icon color="#d03050"><CloseCircleOutline /></n-icon>
                    </template>
                    退稿
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="决策评语" path="comment">
              <div class="markdown-editor-wrapper">
                <v-md-editor
                  v-model="formData.comment"
                  height="300px"
                  placeholder="请输入终审评语，支持Markdown格式..."
                />
              </div>
            </n-form-item>
            <n-form-item>
              <n-space>
                <n-button
                  :type="formData.decision === 'accepted' ? 'success' : 'error'"
                  size="large"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  确认{{ formData.decision === 'accepted' ? '录用' : '退稿' }}
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
import { NCard, NButton, NIcon, NTag, NSpace, NAvatar, NDescriptions, NDescriptionsItem, NTabs, NTabPane, NForm, NFormItem, NRadioGroup, NRadio, NRate, NSpin, useMessage, useDialog } from 'naive-ui'
import { ArrowBackOutline, CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getManuscript, makeDecision } from '@/api/manuscript'
import type { Manuscript, DecisionRequest } from '@/types'
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

const formData = reactive<Omit<DecisionRequest, 'manuscriptId'>>({
  decision: 'accepted',
  comment: ''
})

const rules: FormRules = {
  decision: [
    { required: true, message: '请选择决策结果', trigger: 'change' }
  ],
  comment: [
    { required: true, message: '请输入决策评语', trigger: 'blur' },
    { min: 10, message: '决策评语不少于10个字', trigger: 'blur' }
  ]
}

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function goBack() {
  router.push('/chief/decision')
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
    
    const actionText = formData.decision === 'accepted' ? '录用' : '退稿'
    
    dialog.warning({
      title: `确认${actionText}`,
      content: `确定要${actionText}这篇稿件吗？此操作不可撤销。`,
      positiveText: `确认${actionText}`,
      negativeText: '取消',
      positiveButtonProps: {
        type: formData.decision === 'accepted' ? 'success' : 'error'
      },
      onPositiveClick: async () => {
        const id = Number(route.params.id)
        submitting.value = true
        try {
          await makeDecision({
            manuscriptId: id,
            decision: formData.decision,
            comment: formData.comment
          })
          message.success(`已${actionText}该稿件`)
          router.push('/chief/decision')
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
.decision-detail-page {
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

.review-info,
.author-info {
  margin: 24px 0;
}

.rating-text {
  margin-left: 8px;
  font-size: 13px;
  color: #666;
}

.comment-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
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

.decision-card {
  margin-bottom: 24px;
}

.markdown-editor-wrapper {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

:deep(.v-md-editor) {
  border: none;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box;
}

:deep(.v-md-editor__toolbar) {
  width: 100% !important;
  box-sizing: border-box;
}

:deep(.v-md-editor__editor-wrapper) {
  width: 100% !important;
  box-sizing: border-box;
}

:deep(.v-md-editor__editor),
:deep(.v-md-editor__preview) {
  width: 100% !important;
  box-sizing: border-box;
}

:deep(.n-tabs) {
  margin-top: 16px;
}
</style>
