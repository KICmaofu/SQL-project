import request from '@/utils/request'
import { StudentInfo } from '@/types/entity'

export const register = (username: string, password: string, realName: string): Promise<number> => {
  return request.post('/auth/register', { username, password, realName })
}

export const login = (username: string, password: string): Promise<{ token: string; studentInfo: StudentInfo }> => {
  return request.post('/auth/login', { username, password })
}
