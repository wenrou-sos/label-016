import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole, LoginRequest, RegisterRequest } from '@/types'
import { login, register, logout, getCurrentUser } from '@/api/auth'
import { setToken, removeToken, setUser, getUser } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(getUser())

  const isAuthenticated = computed(() => !!token.value || !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAuthor = computed(() => user.value?.role === 'author')
  const isEditor = computed(() => user.value?.role === 'editor')
  const isChief = computed(() => user.value?.role === 'chief_editor')

  function hasRole(role: UserRole | UserRole[]): boolean {
    if (!user.value) return false
    if (Array.isArray(role)) {
      return role.includes(user.value.role)
    }
    return user.value.role === role
  }

  async function loginAction(data: LoginRequest) {
    const res = await login(data)
    token.value = res.token
    user.value = res.user
    setToken(res.token)
    setUser(res.user)
    return res
  }

  async function registerAction(data: RegisterRequest) {
    const res = await register(data)
    token.value = res.token
    user.value = res.user
    setToken(res.token)
    setUser(res.user)
    return res
  }

  async function logoutAction() {
    try {
      await logout()
    } finally {
      token.value = null
      user.value = null
      removeToken()
    }
  }

  async function fetchCurrentUser() {
    const res = await getCurrentUser()
    user.value = res
    setUser(res)
    return res
  }

  function initAuth() {
    const savedToken = localStorage.getItem('manuscript_token')
    if (savedToken) {
      token.value = savedToken
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    userRole,
    isAuthor,
    isEditor,
    isChief,
    hasRole,
    loginAction,
    registerAction,
    logoutAction,
    fetchCurrentUser,
    initAuth
  }
})
