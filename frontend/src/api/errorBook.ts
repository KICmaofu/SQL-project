import request from '@/utils/request'
import { ErrorItem, PageResult } from '@/types/entity'
import { PageParams } from '@/types/api'

interface ErrorListParams extends PageParams {
  masterStatus?: string
}

export const getErrorList = (params: ErrorListParams): Promise<PageResult<ErrorItem>> => {
  return request.get('/error/list', { params })
}

export const markMaster = (id: number): Promise<void> => {
  return request.post(`/error/${id}/master`)
}
