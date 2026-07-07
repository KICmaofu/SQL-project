import request from '@/utils/request'
import { SqlExecuteResult } from '@/types/entity'

export const executeSql = (sql: string): Promise<SqlExecuteResult> => {
  return request.post('/sql/execute', { sql })
}
