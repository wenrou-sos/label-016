export type UserRole = 'author' | 'editor' | 'chief_editor'

export interface User {
  id: number
  username: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

export type ManuscriptStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected'

export const TAGS = [
  '科技', '文化', '经济', '教育', '医学',
  '艺术', '历史', '社会', '环境', '政治', '体育', '文学'
] as const

export type Tag = typeof TAGS[number]

export interface Manuscript {
  id: number
  title: string
  abstract: string
  content: string
  tags: Tag[]
  status: ManuscriptStatus
  authorId: number
  author?: User
  views: number
  editorRating?: number
  editorComment?: string
  editorId?: number
  editor?: User
  chiefDecision?: 'accepted' | 'rejected'
  chiefComment?: string
  chiefId?: number
  chief?: User
  submittedAt: string
  reviewedAt?: string
  decidedAt?: string
  publishedAt?: string
}

export interface ManuscriptSubmitRequest {
  title: string
  abstract: string
  content: string
  tags: Tag[]
}

export interface ReviewRequest {
  manuscriptId: number
  rating: number
  comment: string
}

export interface DecisionRequest {
  manuscriptId: number
  decision: 'accepted' | 'rejected'
  comment: string
}

export interface ReviewHistory {
  id: number
  manuscriptId: number
  reviewerId: number
  reviewer?: User
  role: 'editor' | 'chief_editor'
  rating?: number
  comment: string
  decision?: 'accepted' | 'rejected'
  createdAt: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ManuscriptFilterParams extends PaginationParams {
  status?: ManuscriptStatus
  tags?: Tag[]
  keyword?: string
}
