import request from '@/utils/request'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types'

export function login(data: LoginRequest) {
  return request<AuthResponse>({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function register(data: RegisterRequest) {
  return request<AuthResponse>({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getCurrentUser() {
  return request<User>({
    url: '/auth/me',
    method: 'get'
  })
}
