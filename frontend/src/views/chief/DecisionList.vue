<template>
  <div class="decision-list-page">
    <n-card :bordered="false">
      <template #header>
        <div class="card-header">
          <h2 class="title">终审稿件</h2>
          <n-badge :value="manuscriptStore.total" :max="99" type="info">
            <span class="subtitle">共 {{ manuscriptStore.total }} 篇待终审</span>
          </n-badge>
        </div>
      </template>

      <div class="search-section">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索稿件标题、作者..."
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
          style="width: 300px"
        >
          <template #prefix>
            <n-icon><SearchOutline /></n-icon>
          </template>
        </n-input>
      </div>

      <n-spin :show="manuscriptStore.loading">
        <div v-if="manuscriptStore.manuscripts.length > 0" class="manuscript-list">
          <n-card
            v-for="manuscript in manuscriptStore.manuscripts"
            :key="manuscript.id"
            hoverable
            class="manuscript-item"
            @click="goToDecision(manuscript.id)"
          >
            <div class="item-header">
              <h3 class="item-title">{{ manuscript.title }}</h3>
              <n-tag type="info" size="small">审核中</n-tag>
            </div>
            <p class="item-abstract">{{ manuscript.abstract }}</p>
            <div class="item-tags">
              <n-tag
                v-for="tag in manuscript.tags"
                :key="tag"
                type="info"
                size="small"
              >
                {{ tag }}
              </n-tag>
            </div>
            <div class="item-review-info">
              <n-descriptions :column="2" size="small" bordered>
                <n-descriptions-item label="编辑评分">
                  <n-rate :value="manuscript.editorRating || 0" readonly size="small" />
                  <span class="rating-text">{{ manuscript.editorRating || 0 }} 星</span>
                </n-descriptions-item>
                <n-descriptions-item label="审核编辑">
                  {{ manuscript.editor?.username || '-' }}
                </n-descriptions-item>
              </n-descriptions>
            </div>
            <div class="item-footer">
              <n-space>
                <n-avatar size="small">
                  {{ manuscript.author?.username?.charAt(0)?.toUpperCase() }}
                </n-avatar>
                <span class="author">{{ manuscript.author?.username }}</span>
              </n-space>
              <span class="date">
                <n-icon size="14"><TimeOutline /></n-icon>
                {{ formatDate(manuscript.reviewedAt || manuscript.submittedAt) }}
              </span>
            </div>
          </n-card>
        </div>
        <n-empty v-else-if="!manuscriptStore.loading" description="暂无待终审稿件" />
      </n-spin>

      <div v-if="manuscriptStore.total > 0" class="pagination">
        <n-pagination
          v-model:page="manuscriptStore.page"
          v-model:page-size="manuscriptStore.pageSize"
          :item-count="manuscriptStore.total"
          :page-sizes="[10, 20, 50]"
          show-size-picker
          show-quick-jumper
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NIcon, NInput, NSpace, NAvatar, NTag, NBadge, NSpin, NEmpty, NPagination, NDescriptions, NDescriptionsItem, NRate } from 'naive-ui'
import { SearchOutline, TimeOutline } from '@vicons/ionicons5'
import { useManuscriptStore } from '@/stores/manuscript'
import dayjs from 'dayjs'

const router = useRouter()
const manuscriptStore = useManuscriptStore()

const searchKeyword = ref('')

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function goToDecision(id: number) {
  router.push(`/chief/decision/${id}`)
}

function handleSearch() {
  manuscriptStore.setKeyword(searchKeyword.value)
  manuscriptStore.fetchFinalDecision()
}

function handlePageChange(page: number) {
  manuscriptStore.setPage(page)
  manuscriptStore.fetchFinalDecision()
}

function handlePageSizeChange(size: number) {
  manuscriptStore.setPageSize(size)
  manuscriptStore.fetchFinalDecision()
}

onMounted(() => {
  manuscriptStore.fetchFinalDecision()
})
</script>

<style scoped>
.decision-list-page {
  max-width: 900px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.manuscript-list {
  margin-bottom: 24px;
}

.manuscript-item {
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.manuscript-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.item-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.item-abstract {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.item-review-info {
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.rating-text {
  margin-left: 8px;
  font-size: 13px;
  color: #666;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: #999;
}

.author {
  color: #666;
}

.date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>
