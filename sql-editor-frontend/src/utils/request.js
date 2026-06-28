import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
  baseURL: '/',
  timeout: 30000,
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      message.error('请求失败：' + error.response.status)
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error('请求错误：' + error.message)
    }
    return Promise.reject(error)
  }
)

export default request
