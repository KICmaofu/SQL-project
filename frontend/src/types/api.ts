export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface PageParams {
  current: number
  size: number
}
