import { create } from 'zustand'
import { ChapterTree, TaskDetail, StudyProgress } from '@/types/entity'

interface StudyState {
  chapterTree: ChapterTree[]
  activeTaskId: number | null
  activeTaskDetail: TaskDetail | null
  progress: StudyProgress | null
  setChapterTree: (tree: ChapterTree[]) => void
  setActiveTaskId: (id: number | null) => void
  setActiveTaskDetail: (detail: TaskDetail | null) => void
  setProgress: (progress: StudyProgress | null) => void
}

export const useStudyStore = create<StudyState>((set) => ({
  chapterTree: [],
  activeTaskId: null,
  activeTaskDetail: null,
  progress: null,
  setChapterTree: (tree) => set({ chapterTree: tree }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setActiveTaskDetail: (detail) => set({ activeTaskDetail: detail }),
  setProgress: (progress) => set({ progress }),
}))
