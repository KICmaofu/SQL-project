import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const token = useUserStore((state) => state.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default AuthGuard
