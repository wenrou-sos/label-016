<template>
  <n-popover
    :show="showPopover"
    trigger="click"
    placement="bottom-end"
    :show-arrow="false"
    :overlay-style="{ width: '400px', padding: 0 }"
    @update:show="handleShowChange"
  >
    <template #trigger>
      <div class="notification-trigger" @click="handleTriggerClick">
        <n-badge :value="unreadCount" :show-zero="false" :max="99">
          <n-button quaternary circle>
            <template #icon>
              <n-icon size="20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </n-icon>
            </template>
          </n-button>
        </n-badge>
      </div>
    </template>

    <div class="notification-panel">
      <div class="notification-header">
        <span class="notification-title">消息通知</span>
        <n-button
          v-if="unreadCount > 0"
          quaternary
          size="small"
          @click.stop="handleMarkAllRead"
        >
          全部已读
        </n-button>
      </div>

      <div class="notification-list" ref="listRef">
        <div v-if="loading" class="notification-empty">
          <n-spin size="small" />
        </div>
        <div v-else-if="notifications.length === 0" class="notification-empty">
          <n-empty description="暂无通知消息" />
        </div>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'is-read': notification.isRead }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-icon">
            <n-icon :component="getNotificationIcon(notification.type)" :size="18" />
          </div>
          <div class="notification-content">
            <div class="notification-item-title">{{ notification.title }}</div>
            <div class="notification-item-body">{{ notification.content }}</div>
            <div class="notification-item-time">{{ formatTime(notification.createdAt) }}</div>
          </div>
          <div v-if="!notification.isRead" class="notification-dot"></div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="notification-footer">
        <n-pagination
          v-model:page="currentPage"
          :page-size="pageSize"
          :total="total"
          simple
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { NPopover, NBadge, NButton, NIcon, NSpin, NEmpty, NPagination, useMessage } from 'naive-ui'
import { useNotificationStore } from '@/stores/notification'
import { useUserStore } from '@/stores/user'
import type { Notification, NotificationType } from '@/types'

const router = useRouter()
const message = useMessage()
const notificationStore = useNotificationStore()
const userStore = useUserStore()

const showPopover = ref(false)
const currentPage = ref(1)
let pollingTimer: number | null = null

const { notifications, unreadCount, loading, page, pageSize, total, totalPages } = notificationStore

function getNotificationIcon(type: NotificationType) {
  const icons: Record<NotificationType, any> = {
    submission: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { x1: '16', y1: '17', x2: '8', y2: '17' })
    ]),
    review: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }),
      h('polyline', { points: '9 10 12 13 17 8' })
    ]),
    decision: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
      h('polyline', { points: '22 4 12 14.01 9 11.01' })
    ]),
    system: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
      h('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
    ])
  }
  return icons[type] || icons.system
}

function h(tag: string, props: any, children?: any[]) {
  return { tag, props, children }
}

function formatTime(time: string) {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN')
}

async function handleTriggerClick() {
  if (!userStore.isAuthenticated) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  
  currentPage.value = 1
  await notificationStore.fetchNotifications({ page: 1, isRead: undefined })
}

async function handleShowChange(show: boolean) {
  showPopover.value = show
}

async function handleNotificationClick(notification: Notification) {
  if (!notification.isRead) {
    await notificationStore.markNotificationAsRead([notification.id])
  }
  
  if (notification.manuscriptId) {
    router.push(`/article/${notification.manuscriptId}`)
  }
  
  showPopover.value = false
}

async function handleMarkAllRead() {
  await notificationStore.markAllNotificationAsRead()
  message.success('已全部标记为已读')
}

async function handlePageChange(page: number) {
  currentPage.value = page
  await notificationStore.fetchNotifications({ page })
}

function startPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
  }
  
  if (userStore.isAuthenticated) {
    notificationStore.fetchUnreadCount()
    
    pollingTimer = window.setInterval(() => {
      notificationStore.fetchUnreadCount()
    }, 30000)
  }
}

watch(() => userStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    startPolling()
  } else {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
    notificationStore.reset()
  }
}, { immediate: true })

onMounted(() => {
  if (userStore.isAuthenticated) {
    startPolling()
  }
})

onUnmounted(() => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
  }
})
</script>

<style scoped>
.notification-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.notification-panel {
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow: hidden;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
}

.notification-title {
  font-size: 14px;
  color: #1f1f1f;
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  max-height: 380px;
}

.notification-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.notification-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-item.is-read {
  opacity: 0.6;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e8f4ff;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-item-body {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-item-time {
  font-size: 12px;
  color: #999;
}

.notification-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f56c6c;
  margin-left: 8px;
  flex-shrink: 0;
  margin-top: 6px;
}

.notification-footer {
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: center;
}
</style>
