import axios, { InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { useUserStore } from '@/store/userStore'
import { ApiResult } from '@/types/api'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    const result = response.data as ApiResult<any>
    if (result.code === 200) {
      return result.data
    } else if (result.code === 401) {
      useUserStore.getState().logout()
      window.location.href = '/login'
      message.error('登录已过期，请重新登录')
      return Promise.reject(new Error(result.message))
    } else {
      message.error(result.message || '请求失败')
      return Promise.reject(new Error(result.message))
    }
  },
  (error) => {
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
