import request from '@/utils/request'
import { ChapterTree, TaskDetail, StudyProgress } from '@/types/entity'

export const getChapterTree = (): Promise<ChapterTree[]> => {
  return request.get('/study/tree')
}

export const getTaskDetail = (taskId: number): Promise<TaskDetail> => {
  return request.get(`/study/task/${taskId}`)
}

export const markTaskComplete = (taskId: number): Promise<void> => {
  return request.post(`/study/task/${taskId}/complete`)
}

export const resetTask = (taskId: number): Promise<void> => {
  return request.post(`/study/task/${taskId}/reset`)
}

export const getProgress = (): Promise<StudyProgress> => {
  return request.get('/study/progress')
}
