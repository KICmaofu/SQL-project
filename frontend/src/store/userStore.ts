import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StudentInfo } from '@/types/entity'

interface UserState {
  token: string
  studentInfo: StudentInfo | null
  setToken: (token: string) => void
  setStudentInfo: (info: StudentInfo | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: '',
      studentInfo: null,
      setToken: (token) => set({ token }),
      setStudentInfo: (info) => set({ studentInfo: info }),
      logout: () => set({ token: '', studentInfo: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)
