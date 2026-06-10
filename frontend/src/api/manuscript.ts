import request from '@/utils/request'
import type {
  Manuscript,
  ManuscriptSubmitRequest,
  ReviewRequest,
  DecisionRequest,
  ReviewHistory,
  ManuscriptFilterParams,
  PaginatedResponse
} from '@/types'

export function submitManuscript(data: ManuscriptSubmitRequest) {
  return request<Manuscript>({
    url: '/manuscripts',
    method: 'post',
    data: {
      title: data.title,
      summary: data.abstract,
      content: data.content,
      tags: data.tags
    }
  })
}

export function getManuscript(id: number) {
  return request<Manuscript>({
    url: `/manuscripts/${id}`,
    method: 'get'
  })
}

export function getPublishedManuscripts(params: ManuscriptFilterParams) {
  return request<PaginatedResponse<Manuscript>>({
    url: '/manuscripts/published',
    method: 'get',
    params: {
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword,
      tags: params.tags
    }
  })
}

export function getMyManuscripts(params: ManuscriptFilterParams) {
  return request<PaginatedResponse<Manuscript>>({
    url: '/manuscripts',
    method: 'get',
    params: {
      page: params.page,
      pageSize: params.pageSize,
      status: params.status
    }
  })
}

export function getPendingManuscripts(params: ManuscriptFilterParams) {
  return request<PaginatedResponse<Manuscript>>({
    url: '/manuscripts',
    method: 'get',
    params: {
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword,
      tags: params.tags
    }
  })
}

export function getFinalDecisionManuscripts(params: ManuscriptFilterParams) {
  return request<PaginatedResponse<Manuscript>>({
    url: '/manuscripts',
    method: 'get',
    params: {
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword
    }
  })
}

export function reviewManuscript(data: ReviewRequest) {
  return request<Manuscript>({
    url: `/manuscripts/${data.manuscriptId}/review`,
    method: 'post',
    data: {
      score: data.rating,
      comment: data.comment
    }
  })
}

export function makeDecision(data: DecisionRequest) {
  return request<Manuscript>({
    url: `/manuscripts/${data.manuscriptId}/decision`,
    method: 'post',
    data: {
      decision: data.decision,
      comment: data.comment
    }
  })
}

export function getReviewHistory(manuscriptId: number) {
  return request<ReviewHistory[]>({
    url: `/manuscripts/${manuscriptId}/history`,
    method: 'get'
  })
}

export function getPublishedManuscript(id: number) {
  return request<Manuscript>({
    url: `/manuscripts/published/${id}`,
    method: 'get'
  })
}
