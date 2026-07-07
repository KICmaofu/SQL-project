export interface StudentInfo {
  id: number
  username: string
  realName: string
}

export interface TaskInfo {
  id: number
  taskName: string
  studyStatus: 'UNSTARTED' | 'STUDYING' | 'COMPLETED'
}

export interface ChapterTree {
  id: number
  chapterName: string
  description: string
  unlocked: boolean
  totalTask: number
  completedTask: number
  tasks: TaskInfo[]
}

export interface TaskDetail {
  id: number
  chapterId: number
  taskName: string
  knowledgeContent: string
  exampleSql: string
  practiceQuestion: string
}

export interface StudyProgress {
  totalTask: number
  completedTask: number
  completedChapter: number
  progressRate: number
}

export interface SqlExecuteResult {
  type: 'QUERY' | 'UPDATE'
  columns?: Array<{ name: string; type: string }>
  rows?: any[][]
  total?: number
  affectedRows?: number
  costTime: number
}

export interface ErrorItem {
  id: number
  studentId: number
  sqlContent: string
  errorMsg: string
  masterStatus: 'UNMASTERED' | 'MASTERED'
  createTime: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}
