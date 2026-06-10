import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, NotificationListParams } from '@/types'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} from '@/api/notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(20)
  const total = ref(0)
  const totalPages = ref(0)

  const hasUnread = computed(() => unreadCount.value > 0)

  async function fetchUnreadCount() {
    try {
      const res = await getUnreadCount()
      unreadCount.value = res.unreadCount
    } catch (e) {
      console.error('获取未读数量失败', e)
    }
  }

  async function fetchNotifications(params?: NotificationListParams) {
    loading.value = true
    try {
      const res = await getNotifications({
        page: page.value,
        pageSize: pageSize.value,
        ...params
      })
      notifications.value = res.items
      total.value = res.total
      totalPages.value = res.totalPages
      page.value = res.page
      pageSize.value = res.pageSize
    } catch (e) {
      console.error('获取通知列表失败', e)
    } finally {
      loading.value = false
    }
  }

  async function markNotificationAsRead(ids: number[]) {
    try {
      await markAsRead({ ids })
      ids.forEach(id => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
          notification.isRead = true
        }
      })
      unreadCount.value = Math.max(0, unreadCount.value - ids.length)
    } catch (e) {
      console.error('标记已读失败', e)
    }
  }

  async function markAllNotificationAsRead() {
    try {
      await markAllAsRead()
      notifications.value.forEach(n => {
        n.isRead = true
      })
      unreadCount.value = 0
    } catch (e) {
      console.error('全部标记已读失败', e)
    }
  }

  function reset() {
    notifications.value = []
    unreadCount.value = 0
    loading.value = false
    page.value = 1
    pageSize.value = 20
    total.value = 0
    totalPages.value = 0
  }

  return {
    notifications,
    unreadCount,
    loading,
    page,
    pageSize,
    total,
    totalPages,
    hasUnread,
    fetchUnreadCount,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationAsRead,
    reset
  }
})
