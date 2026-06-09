import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios'
import { getToken, removeToken } from './auth'

let messageInstance: any = null
let routerInstance: any = null

export function setMessageInstance(instance: any) {
  messageInstance = instance
}

export function setRouterInstance(instance: any) {
  routerInstance = instance
}

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.code !== 200) {
      if (messageInstance) {
        messageInstance.error(res.message || '请求失败')
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (messageInstance) {
            messageInstance.error('登录已过期，请重新登录')
          }
          removeToken()
          if (routerInstance) {
            routerInstance.push('/login')
          }
          break
        case 403:
          if (messageInstance) {
            messageInstance.error('没有权限访问')
          }
          break
        case 404:
          if (messageInstance) {
            messageInstance.error('请求的资源不存在')
          }
          break
        case 500:
          if (messageInstance) {
            messageInstance.error('服务器错误')
          }
          break
        default:
          if (messageInstance) {
            messageInstance.error(error.response.data?.message || '请求失败')
          }
      }
    } else {
      if (messageInstance) {
        messageInstance.error('网络错误，请检查网络连接')
      }
    }
    return Promise.reject(error)
  }
)

export default function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>
}

export { service }
