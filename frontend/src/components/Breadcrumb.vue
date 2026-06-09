<template>
  <n-breadcrumb class="breadcrumb">
    <n-breadcrumb-item @click="goHome">
      <n-icon><HomeOutline /></n-icon>
      首页
    </n-breadcrumb-item>
    <n-breadcrumb-item
      v-for="(item, index) in breadcrumbItems"
      :key="index"
      @click="item.path && goTo(item.path)"
    >
      {{ item.label }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NBreadcrumb, NBreadcrumbItem, NIcon } from 'naive-ui'
import { HomeOutline } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()

interface BreadcrumbItem {
  label: string
  path?: string
}

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const path = route.path
  const items: BreadcrumbItem[] = []
  
  if (path.startsWith('/author')) {
    items.push({ label: '作者工作台', path: '/author/manuscripts' })
    if (path === '/author/submit') {
      items.push({ label: '提交稿件' })
    } else if (path === '/author/manuscripts') {
      items.push({ label: '我的稿件' })
    } else if (path.startsWith('/author/manuscripts/')) {
      items.push({ label: '我的稿件', path: '/author/manuscripts' })
      items.push({ label: '稿件详情' })
    }
  } else if (path.startsWith('/editor')) {
    items.push({ label: '编辑工作台', path: '/editor/review' })
    if (path === '/editor/review') {
      items.push({ label: '待审稿件' })
    } else if (path.startsWith('/editor/review/')) {
      items.push({ label: '待审稿件', path: '/editor/review' })
      items.push({ label: '审稿' })
    }
  } else if (path.startsWith('/chief')) {
    items.push({ label: '主编工作台', path: '/chief/decision' })
    if (path === '/chief/decision') {
      items.push({ label: '终审稿件' })
    } else if (path.startsWith('/chief/decision/')) {
      items.push({ label: '终审稿件', path: '/chief/decision' })
      items.push({ label: '终审决策' })
    }
  } else if (path.startsWith('/article/')) {
    items.push({ label: '稿件详情' })
  }
  
  return items
})

function goHome() {
  router.push('/')
}

function goTo(path: string) {
  router.push(path)
}
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 16px;
}
</style>
