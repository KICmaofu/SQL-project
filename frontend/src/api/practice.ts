import request from '@/utils/request'

export const resetPractice = (): Promise<void> => {
  return request.post('/practice/reset')
}
