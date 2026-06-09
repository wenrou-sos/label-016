import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Manuscript, Tag, ManuscriptStatus, ManuscriptFilterParams, PaginatedResponse } from '@/types'
import { getPublishedManuscripts, getMyManuscripts, getPendingManuscripts, getFinalDecisionManuscripts } from '@/api/manuscript'

export const useManuscriptStore = defineStore('manuscript', () => {
  const manuscripts = ref<Manuscript[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const selectedTags = ref<Tag[]>([])
  const keyword = ref('')
  const statusFilter = ref<ManuscriptStatus | undefined>(undefined)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  const filterParams = computed<ManuscriptFilterParams>(() => ({
    page: page.value,
    pageSize: pageSize.value,
    tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
    keyword: keyword.value || undefined,
    status: statusFilter.value
  }))

  function resetFilters() {
    page.value = 1
    selectedTags.value = []
    keyword.value = ''
    statusFilter.value = undefined
  }

  async function fetchPublished(params?: Partial<ManuscriptFilterParams>) {
    loading.value = true
    try {
      if (params?.page !== undefined) page.value = params.page
      if (params?.pageSize !== undefined) pageSize.value = params.pageSize
      if (params?.tags !== undefined) selectedTags.value = params.tags
      if (params?.keyword !== undefined) keyword.value = params.keyword
      
      const res: PaginatedResponse<Manuscript> = await getPublishedManuscripts(filterParams.value)
      manuscripts.value = res.items
      total.value = res.total
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchMyManuscripts(params?: Partial<ManuscriptFilterParams>) {
    loading.value = true
    try {
      if (params?.page !== undefined) page.value = params.page
      if (params?.pageSize !== undefined) pageSize.value = params.pageSize
      if (params?.status !== undefined) statusFilter.value = params.status

      const res: PaginatedResponse<Manuscript> = await getMyManuscripts(filterParams.value)
      manuscripts.value = res.items
      total.value = res.total
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchPending(params?: Partial<ManuscriptFilterParams>) {
    loading.value = true
    try {
      if (params?.page !== undefined) page.value = params.page
      if (params?.pageSize !== undefined) pageSize.value = params.pageSize
      if (params?.tags !== undefined) selectedTags.value = params.tags
      if (params?.keyword !== undefined) keyword.value = params.keyword

      const res: PaginatedResponse<Manuscript> = await getPendingManuscripts(filterParams.value)
      manuscripts.value = res.items
      total.value = res.total
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchFinalDecision(params?: Partial<ManuscriptFilterParams>) {
    loading.value = true
    try {
      if (params?.page !== undefined) page.value = params.page
      if (params?.pageSize !== undefined) pageSize.value = params.pageSize
      if (params?.keyword !== undefined) keyword.value = params.keyword

      const res: PaginatedResponse<Manuscript> = await getFinalDecisionManuscripts(filterParams.value)
      manuscripts.value = res.items
      total.value = res.total
      return res
    } finally {
      loading.value = false
    }
  }

  function setPage(newPage: number) {
    page.value = newPage
  }

  function setPageSize(newSize: number) {
    pageSize.value = newSize
    page.value = 1
  }

  function toggleTag(tag: Tag) {
    const index = selectedTags.value.indexOf(tag)
    if (index === -1) {
      selectedTags.value.push(tag)
    } else {
      selectedTags.value.splice(index, 1)
    }
    page.value = 1
  }

  function setKeyword(newKeyword: string) {
    keyword.value = newKeyword
    page.value = 1
  }

  function setStatusFilter(status: ManuscriptStatus | undefined) {
    statusFilter.value = status
    page.value = 1
  }

  return {
    manuscripts,
    loading,
    total,
    page,
    pageSize,
    totalPages,
    selectedTags,
    keyword,
    statusFilter,
    filterParams,
    resetFilters,
    fetchPublished,
    fetchMyManuscripts,
    fetchPending,
    fetchFinalDecision,
    setPage,
    setPageSize,
    toggleTag,
    setKeyword,
    setStatusFilter
  }
})
