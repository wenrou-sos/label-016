<template>
  <div class="home-page">
    <Navbar />
    <div class="home-content">
      <div class="hero-section">
        <h1 class="hero-title">稿件管理系统</h1>
        <p class="hero-subtitle">专业的学术稿件投稿、审核、发布平台</p>
      </div>
      
      <div class="content-wrapper">
        <div class="search-section">
          <n-input
            v-model:value="searchKeyword"
            size="large"
            placeholder="搜索稿件标题、摘要..."
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <n-icon><SearchOutline /></n-icon>
            </template>
            <template #suffix>
              <n-button type="primary" size="small" @click="handleSearch">搜索</n-button>
            </template>
          </n-input>
        </div>

        <TagFilter v-model="selectedTags" @update:model-value="handleTagChange" />

        <n-spin :show="manuscriptStore.loading">
          <div v-if="manuscriptStore.manuscripts.length > 0" class="manuscript-list">
            <ManuscriptCard
              v-for="manuscript in manuscriptStore.manuscripts"
              :key="manuscript.id"
              :manuscript="manuscript"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NInput, NButton, NIcon, NSpin, NEmpty, NPagination } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import Navbar from '@/components/Navbar.vue'
import TagFilter from '@/components/TagFilter.vue'
import ManuscriptCard from '@/components/ManuscriptCard.vue'
import { useManuscriptStore } from '@/stores/manuscript'
import type { Tag } from '@/types'

const manuscriptStore = useManuscriptStore()

const searchKeyword = ref('')
const selectedTags = ref<Tag[]>([])

function handleSearch() {
  manuscriptStore.setKeyword(searchKeyword.value)
  manuscriptStore.fetchPublished()
}

function handleTagChange(tags: Tag[]) {
  selectedTags.value = tags
  manuscriptStore.fetchPublished({ tags })
}

function handlePageChange(page: number) {
  manuscriptStore.setPage(page)
  manuscriptStore.fetchPublished()
}

function handlePageSizeChange(size: number) {
  manuscriptStore.setPageSize(size)
  manuscriptStore.fetchPublished()
}

onMounted(() => {
  manuscriptStore.fetchPublished()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.home-content {
  padding-top: 64px;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  text-align: center;
  color: #fff;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.hero-subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.content-wrapper {
  max-width: 900px;
  margin: -40px auto 0;
  padding: 0 20px 40px;
  position: relative;
  z-index: 10;
}

.search-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.manuscript-list {
  margin-bottom: 24px;
}

.pagination {
  display: flex;
  justify-content: center;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}
</style>
