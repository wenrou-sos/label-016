import request from '@/utils/request'
import type {
  Notification,
  NotificationListParams,
  MarkReadParams,
  PaginatedResponse
} from '@/types'

export function getNotifications(params: NotificationListParams) {
  return request<PaginatedResponse<Notification>>({
    url: '/notifications',
    method: 'get',
    params
  })
}

export function getUnreadCount() {
  return request<{ unreadCount: number }>({
    url: '/notifications/unread-count',
    method: 'get'
  })
}

export function markAsRead(data: MarkReadParams) {
  return request({
    url: '/notifications/mark-read',
    method: 'post',
    data
  })
}

export function markAllAsRead() {
  return request({
    url: '/notifications/mark-all-read',
    method: 'post'
  })
}
