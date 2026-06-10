import type { ManuscriptStatus, UserRole } from '@/types'

export const statusMap: Record<ManuscriptStatus, { label: string; type: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  pending: { label: '待审', type: 'warning' },
  reviewing: { label: '审核中', type: 'info' },
  accepted: { label: '已录用', type: 'success' },
  rejected: { label: '已退稿', type: 'error' }
}

export const roleMap: Record<UserRole, { label: string; color: string }> = {
  author: { label: '作者', color: '#2080f0' },
  editor: { label: '编辑', color: '#18a058' },
  chief_editor: { label: '主编', color: '#d03050' }
}

export function getStatusLabel(status: ManuscriptStatus): string {
  return statusMap[status]?.label || status
}

export function getStatusType(status: ManuscriptStatus): string {
  return statusMap[status]?.type || 'default'
}

export function getRoleLabel(role: UserRole): string {
  return roleMap[role]?.label || role
}

export function getRoleColor(role: UserRole): string {
  return roleMap[role]?.color || '#333'
}
