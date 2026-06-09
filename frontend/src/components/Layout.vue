<template>
  <n-layout has-sider>
    <Sidebar v-if="showSidebar" :menu-items="menuItems" />
    <n-layout>
      <Navbar v-if="showNavbar" />
      <n-layout-content class="main-content">
        <div class="content-wrapper">
          <Breadcrumb v-if="showBreadcrumb" />
          <slot />
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import Breadcrumb from './Breadcrumb.vue'
import { useUserStore } from '@/stores/user'

interface Props {
  showSidebar?: boolean
  showNavbar?: boolean
  showBreadcrumb?: boolean
}

withDefaults(defineProps<Props>(), {
  showSidebar: true,
  showNavbar: true,
  showBreadcrumb: true
})

const userStore = useUserStore()

const menuItems = computed(() => {
  const role = userStore.userRole
  if (role === 'author') {
    return [
      { label: '我的稿件', key: '/author/manuscripts', icon: 'document' },
      { label: '提交稿件', key: '/author/submit', icon: 'add' }
    ]
  } else if (role === 'editor') {
    return [
      { label: '待审稿件', key: '/editor/review', icon: 'file-search' }
    ]
  } else if (role === 'chief') {
    return [
      { label: '终审稿件', key: '/chief/decision', icon: 'check-circle' }
    ]
  }
  return []
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
}

.content-wrapper {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
