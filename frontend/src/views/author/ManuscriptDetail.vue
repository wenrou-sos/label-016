<template>
  <div class="manuscript-detail-page">
    <n-spin :show="loading">
      <div v-if="manuscript" class="detail-container">
        <n-card :bordered="false" class="main-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <h1 class="title">{{ manuscript.title }}</h1>
                <n-tag :type="statusType" size="large">
                  {{ statusLabel }}
                </n-tag>
              </div>
              <n-button @click="goBack">
                <template #icon>
                  <n-icon><ArrowBackOutline /></n-icon>
                </template>
                返回列表
              </n-button>
            </div>
          </template>

          <div class="meta-info">
            <n-space size="large">
              <span class="meta-item">
                <n-icon size="16"><TimeOutline /></n-icon>
                提交时间：{{ formatDate(manuscript.submittedAt) }}
              </span>
              <span class="meta-item" v-if="manuscript.reviewedAt">
                <n-icon size="16"><EyeOutline /></n-icon>
                审核时间：{{ formatDate(manuscript.reviewedAt) }}
              </span>
              <span class="meta-item" v-if="manuscript.decidedAt">
                <n-icon size="16"><CheckmarkCircleOutline /></n-icon>
                决策时间：{{ formatDate(manuscript.decidedAt) }}
              </span>
            </n-space>
          </div>

          <div class="tags-section">
            <n-tag
              v-for="tag in manuscript.tags"
              :key="tag"
              type="info"
              size="medium"
            >
              {{ tag }}
            </n-tag>
          </div>

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

            <n-tab-pane name="history" tab="审核历史">
              <n-timeline>
                <n-timeline-item
                  title="稿件提交"
                  :time="formatDate(manuscript.submittedAt)"
                  type="success"
                >
                  作者提交稿件，进入待审状态
                </n-timeline-item>
                <n-timeline-item
                  v-if="manuscript.reviewedAt && manuscript.editor"
                  title="编辑审核"
                  :time="formatDate(manuscript.reviewedAt)"
                  type="info"
                >
                  <template #icon>
                    <n-icon><PersonOutline /></n-icon>
                  </template>
                  <div class="review-content">
                    <p><strong>审核编辑：</strong>{{ manuscript.editor.username }}</p>
                    <p v-if="manuscript.editorRating">
                      <strong>评分：</strong>
                      <n-rate :value="manuscript.editorRating" readonly size="small" />
                      {{ manuscript.editorRating }} 星
                    </p>
                    <p v-if="manuscript.editorComment">
                      <strong>审稿意见：</strong>{{ manuscript.editorComment }}
                    </p>
                  </div>
                </n-timeline-item>
                <n-timeline-item
                  v-if="manuscript.decidedAt && manuscript.chief"
                  title="主编决策"
                  :time="formatDate(manuscript.decidedAt)"
                  :type="manuscript.chiefDecision === 'accepted' ? 'success' : 'error'"
                >
                  <template #icon>
                    <n-icon><PersonOutline /></n-icon>
                  </template>
                  <div class="review-content">
                    <p><strong>主编：</strong>{{ manuscript.chief.username }}</p>
                    <p>
                      <strong>决策结果：</strong>
                      <n-tag :type="manuscript.chiefDecision === 'accepted' ? 'success' : 'error'" size="small">
                        {{ manuscript.chiefDecision === 'accepted' ? '已录用' : '已退稿' }}
                      </n-tag>
                    </p>
                    <p v-if="manuscript.chiefComment">
                      <strong>决策评语：</strong>{{ manuscript.chiefComment }}
                    </p>
                  </div>
                </n-timeline-item>
              </n-timeline>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NButton, NIcon, NTag, NSpace, NTabs, NTabPane, NTimeline, NTimelineItem, NRate, NSpin } from 'naive-ui'
import { ArrowBackOutline, TimeOutline, EyeOutline, CheckmarkCircleOutline, PersonOutline } from '@vicons/ionicons5'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getManuscript } from '@/api/manuscript'
import type { Manuscript } from '@/types'
import { getStatusLabel, getStatusType } from '@/utils/status'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const manuscript = ref<Manuscript | null>(null)
const activeTab = ref('content')

const statusLabel = computed(() => manuscript.value ? getStatusLabel(manuscript.value.status) : '')
const statusType = computed(() => manuscript.value ? getStatusType(manuscript.value.status) as any : 'default')

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function goBack() {
  router.push('/author/manuscripts')
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

onMounted(() => {
  fetchManuscript()
})
</script>

<style scoped>
.manuscript-detail-page {
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

.meta-info {
  padding: 16px 0;
  border-bottom: 1px solid #e8e8e8;
  color: #666;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid #e8e8e8;
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

.review-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 8px;
}

.review-content p {
  margin: 8px 0;
}

:deep(.n-tabs) {
  margin-top: 16px;
}
</style>
