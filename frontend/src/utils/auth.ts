import { useUserStore } from '@/store/userStore'

export const isAuthenticated = () => {
  return !!useUserStore.getState().token
}

export const getToken = () => {
  return useUserStore.getState().token
}
