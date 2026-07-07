import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthGuard from '@/components/AuthGuard'
import Login from '@/pages/Login'
import StudyWorkbench from '@/pages/StudyWorkbench'
import ErrorBook from '@/pages/ErrorBook'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <StudyWorkbench />
      </AuthGuard>
    ),
  },
  {
    path: '/error-book',
    element: (
      <AuthGuard>
        <ErrorBook />
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
