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
    data
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
    params
  })
}

export function getMyManuscripts(params: ManuscriptFilterParams) {
  return request<PaginatedResponse<Manuscript>>({
    url: '/manuscripts/my',
    method: 'get',
    params
  })
}

export function getPendingManuscripts(params: ManuscriptFilterParams) {
  return request<PaginatedResponse<Manuscript>>({
    url: '/manuscripts/pending',
    method: 'get',
    params
  })
}

export function getFinalDecisionManuscripts(params: ManuscriptFilterParams) {
  return request<PaginatedResponse<Manuscript>>({
    url: '/manuscripts/final-decision',
    method: 'get',
    params
  })
}

export function reviewManuscript(data: ReviewRequest) {
  return request<Manuscript>({
    url: `/manuscripts/${data.manuscriptId}/review`,
    method: 'post',
    data: {
      rating: data.rating,
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

export function incrementViews(manuscriptId: number) {
  return request({
    url: `/manuscripts/${manuscriptId}/views`,
    method: 'post'
  })
}
