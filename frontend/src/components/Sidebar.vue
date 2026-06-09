<template>
  <n-layout-sider
    :collapsed-width="64"
    :width="240"
    show-trigger
    collapse-mode="width"
    :native-scrollbar="false"
  >
    <div class="logo">
      <n-icon size="28" color="#2080f0">
        <BookOutline />
      </n-icon>
      <span v-if="!collapsed" class="logo-text">稿件管理</span>
    </div>
    <n-menu
      :value="activeKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      @update:value="handleMenuClick"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NLayoutSider, NMenu, NIcon } from 'naive-ui'
import { BookOutline, DocumentOutline, AddCircleOutline, SearchOutline, CheckmarkCircleOutline } from '@vicons/ionicons5'

interface MenuItem {
  label: string
  key: string
  icon: string
}

interface Props {
  menuItems: MenuItem[]
}

const props = defineProps<Props>()

const collapsed = ref(false)
const route = useRoute()
const router = useRouter()

const iconMap: Record<string, any> = {
  document: DocumentOutline,
  add: AddCircleOutline,
  'file-search': SearchOutline,
  'check-circle': CheckmarkCircleOutline
}

const menuOptions = computed(() => {
  return props.menuItems.map(item => ({
    label: item.label,
    key: item.key,
    icon: () => {
      const IconComponent = iconMap[item.icon] || DocumentOutline
      return h(NIcon, null, { default: () => h(IconComponent) })
    }
  }))
})

const activeKey = computed(() => {
  const path = route.path
  if (path.startsWith('/author/manuscripts/')) return '/author/manuscripts'
  if (path.startsWith('/editor/review/')) return '/editor/review'
  if (path.startsWith('/chief/decision/')) return '/chief/decision'
  return path
})

function handleMenuClick(key: string) {
  router.push(key)
}

import { h } from 'vue'
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text {
  margin-left: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

:deep(.n-layout-sider) {
  background: #001529;
}

:deep(.n-menu) {
  background: #001529;
  border: none;
}

:deep(.n-menu-item-content) {
  color: rgba(255, 255, 255, 0.65);
}

:deep(.n-menu-item-content:hover) {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

:deep(.n-menu-item.n-menu-item--selected .n-menu-item-content) {
  color: #fff;
  background: #1890ff;
}
</style>
