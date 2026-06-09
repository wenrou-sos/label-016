<template>
  <n-card hoverable class="manuscript-card" @click="handleClick">
    <template #header>
      <div class="card-header">
        <h3 class="title">{{ manuscript.title }}</h3>
        <n-tag v-if="showStatus" :type="statusType" size="small">
          {{ statusLabel }}
        </n-tag>
      </div>
    </template>
    <div class="card-body">
      <p class="abstract">{{ manuscript.abstract }}</p>
      <div class="tags">
        <n-tag
          v-for="tag in manuscript.tags"
          :key="tag"
          type="info"
          size="small"
        >
          {{ tag }}
        </n-tag>
      </div>
    </div>
    <template #footer>
      <div class="card-footer">
        <n-space>
          <n-avatar size="small">
            {{ manuscript.author?.username?.charAt(0)?.toUpperCase() }}
          </n-avatar>
          <span class="author">{{ manuscript.author?.username }}</span>
        </n-space>
        <n-space size="large">
          <span class="meta-item">
            <n-icon size="16"><EyeOutline /></n-icon>
            {{ manuscript.views }}
          </span>
          <span class="meta-item">
            <n-icon size="16"><TimeOutline /></n-icon>
            {{ formatDate(manuscript.publishedAt || manuscript.submittedAt) }}
          </span>
        </n-space>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NTag, NSpace, NAvatar, NIcon } from 'naive-ui'
import { EyeOutline, TimeOutline } from '@vicons/ionicons5'
import type { Manuscript } from '@/types'
import { getStatusLabel, getStatusType } from '@/utils/status'
import dayjs from 'dayjs'

interface Props {
  manuscript: Manuscript
  showStatus?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStatus: false,
  clickable: true
})

const router = useRouter()

const statusLabel = computed(() => getStatusLabel(props.manuscript.status))
const statusType = computed(() => getStatusType(props.manuscript.status) as any)

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD')
}

function handleClick() {
  if (!props.clickable) return
  const id = props.manuscript.id
  if (props.showStatus) {
    const path = router.currentRoute.value.path
    if (path.startsWith('/author')) {
      router.push(`/author/manuscripts/${id}`)
    } else if (path.startsWith('/editor')) {
      router.push(`/editor/review/${id}`)
    } else if (path.startsWith('/chief')) {
      router.push(`/chief/decision/${id}`)
    }
  } else {
    router.push(`/article/${id}`)
  }
}
</script>

<style scoped>
.manuscript-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.manuscript-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.abstract {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.author {
  font-size: 13px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #999;
}
</style>
