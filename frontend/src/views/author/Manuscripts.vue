<template>
  <div class="manuscripts-page">
    <n-card :bordered="false">
      <template #header>
        <div class="card-header">
          <h2 class="title">我的稿件</h2>
          <n-button type="primary" @click="goSubmit">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            提交新稿件
          </n-button>
        </div>
      </template>

      <div class="filter-section">
        <n-space>
          <n-select
            v-model:value="statusFilter"
            placeholder="状态筛选"
            :options="statusOptions"
            clearable
            style="width: 160px"
            @update:value="handleStatusFilter"
          />
        </n-space>
      </div>

      <n-spin :show="manuscriptStore.loading">
        <div v-if="manuscriptStore.manuscripts.length > 0" class="manuscript-list">
          <ManuscriptCard
            v-for="manuscript in manuscriptStore.manuscripts"
            :key="manuscript.id"
            :manuscript="manuscript"
            show-status
          />
        </div>
        <n-empty v-else-if="!manuscriptStore.loading" description="暂无稿件" />
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
import { NCard, NButton, NIcon, NSelect, NSpace, NSpin, NEmpty, NPagination } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import ManuscriptCard from '@/components/ManuscriptCard.vue'
import { useManuscriptStore } from '@/stores/manuscript'
import type { ManuscriptStatus } from '@/types'
import { getStatusLabel } from '@/utils/status'

const router = useRouter()
const manuscriptStore = useManuscriptStore()

const statusFilter = ref<ManuscriptStatus | null>(null)

const statusOptions = [
  { label: getStatusLabel('pending'), value: 'pending' },
  { label: getStatusLabel('reviewing'), value: 'reviewing' },
  { label: getStatusLabel('accepted'), value: 'accepted' },
  { label: getStatusLabel('rejected'), value: 'rejected' }
]

function goSubmit() {
  router.push('/author/submit')
}

function handleStatusFilter(value: ManuscriptStatus | null) {
  manuscriptStore.setStatusFilter(value || undefined)
  manuscriptStore.fetchMyManuscripts()
}

function handlePageChange(page: number) {
  manuscriptStore.setPage(page)
  manuscriptStore.fetchMyManuscripts()
}

function handlePageSizeChange(size: number) {
  manuscriptStore.setPageSize(size)
  manuscriptStore.fetchMyManuscripts()
}

onMounted(() => {
  manuscriptStore.fetchMyManuscripts()
})
</script>

<style scoped>
.manuscripts-page {
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

.filter-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.manuscript-list {
  margin-bottom: 24px;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>
