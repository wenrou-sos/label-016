<template>
  <div class="article-detail-page">
    <Navbar />
    <div class="content-wrapper">
      <n-spin :show="loading">
        <div v-if="manuscript" class="article-container">
          <header class="article-header">
            <h1 class="article-title">{{ manuscript.title }}</h1>
            <div class="article-meta">
              <n-space size="large">
                <n-space>
                  <n-avatar size="small">
                    {{ manuscript.author?.username?.charAt(0)?.toUpperCase() }}
                  </n-avatar>
                  <span>{{ manuscript.author?.username }}</span>
                </n-space>
                <span class="meta-item">
                  <n-icon size="16"><CalendarOutline /></n-icon>
                  {{ formatDate(manuscript.publishedAt || manuscript.submittedAt) }}
                </span>
                <span class="meta-item">
                  <n-icon size="16"><EyeOutline /></n-icon>
                  {{ manuscript.views }} 阅读
                </span>
              </n-space>
            </div>
            <div class="article-tags">
              <n-tag
                v-for="tag in manuscript.tags"
                :key="tag"
                type="info"
                size="medium"
              >
                {{ tag }}
              </n-tag>
            </div>
          </header>

          <div class="article-abstract">
            <h3 class="section-title">摘要</h3>
            <p>{{ manuscript.abstract }}</p>
          </div>

          <div class="article-content">
            <MarkdownViewer :content="manuscript.content" />
          </div>
        </div>
        <n-empty v-else-if="!loading" description="稿件不存在" />
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { NSpace, NAvatar, NIcon, NTag, NSpin, NEmpty } from 'naive-ui'
import { CalendarOutline, EyeOutline } from '@vicons/ionicons5'
import Navbar from '@/components/Navbar.vue'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import { getPublishedManuscript } from '@/api/manuscript'
import type { Manuscript } from '@/types'
import dayjs from 'dayjs'

const route = useRoute()
const loading = ref(false)
const manuscript = ref<Manuscript | null>(null)

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

async function fetchManuscript() {
  const id = Number(route.params.id)
  if (!id) return
  
  loading.value = true
  try {
    manuscript.value = await getPublishedManuscript(id)
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
.article-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px;
}

.article-container {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
}

.article-header {
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.article-meta {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-abstract {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.article-abstract p {
  margin: 0;
  color: #666;
  line-height: 1.8;
  font-size: 15px;
}

.article-content {
  padding-top: 24px;
}
</style>
