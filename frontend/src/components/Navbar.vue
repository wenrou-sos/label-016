<template>
  <n-layout-header class="navbar">
    <div class="navbar-left">
      <n-button
        v-if="!userStore.isAuthenticated"
        quaternary
        @click="goHome"
      >
        <template #icon>
          <n-icon><HomeOutline /></n-icon>
        </template>
        首页
      </n-button>
    </div>
    <div class="navbar-right">
      <template v-if="userStore.isAuthenticated">
        <n-space>
          <n-tag :style="{ backgroundColor: roleColor, color: '#fff' }">
            {{ roleLabel }}
          </n-tag>
          <n-dropdown trigger="hover" :options="dropdownOptions" @select="handleDropdownSelect">
            <n-button quaternary>
              <template #icon>
                <n-icon><PersonCircleOutline /></n-icon>
              </template>
              {{ userStore.user?.username }}
            </n-button>
          </n-dropdown>
        </n-space>
      </template>
      <template v-else>
        <n-space>
          <n-button quaternary @click="goLogin">登录</n-button>
          <n-button type="primary" @click="goRegister">注册</n-button>
        </n-space>
      </template>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { NLayoutHeader, NButton, NDropdown, NSpace, NTag, NIcon, useDialog, useMessage } from 'naive-ui'
import { HomeOutline, PersonCircleOutline, LogOutOutline, Home } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'
import { getRoleLabel, getRoleColor } from '@/utils/status'

const router = useRouter()
const userStore = useUserStore()
const dialog = useDialog()
const message = useMessage()

const roleLabel = computed(() => {
  return userStore.user ? getRoleLabel(userStore.user.role) : ''
})

const roleColor = computed(() => {
  return userStore.user ? getRoleColor(userStore.user.role) : '#333'
})

const dropdownOptions = computed(() => {
  const options: any[] = [
    { label: '返回首页', key: 'home', icon: () => h(NIcon, null, { default: () => h(Home) }) }
  ]
  
  if (userStore.user) {
    const role = userStore.user.role
    if (role === 'author') {
      options.push({ label: '作者工作台', key: '/author/manuscripts' })
    } else if (role === 'editor') {
      options.push({ label: '编辑工作台', key: '/editor/review' })
    } else if (role === 'chief_editor') {
      options.push({ label: '主编工作台', key: '/chief/decision' })
    }
  }
  
  options.push(
    { type: 'divider' as const, key: 'd1' },
    { label: '退出登录', key: 'logout', icon: () => h(NIcon, null, { default: () => h(LogOutOutline) }) }
  )
  
  return options
})

function handleDropdownSelect(key: string | number) {
  if (key === 'logout') {
    dialog.warning({
      title: '确认退出',
      content: '确定要退出登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await userStore.logoutAction()
        message.success('已退出登录')
        router.push('/')
      }
    })
  } else if (key === 'home') {
    router.push('/')
  } else {
    router.push(key as string)
  }
}

function goHome() {
  router.push('/')
}

function goLogin() {
  router.push('/login')
}

function goRegister() {
  router.push('/register')
}

import { h } from 'vue'
</script>

<style scoped>
.navbar {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
}
</style>
