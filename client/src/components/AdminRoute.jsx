import { Navigate, Outlet } from 'react-router-dom'
import { getToken, getUser } from '../api/api'

export default function AdminRoute() {
  const token = getToken()
  const user = getUser()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!user?.roles?.includes('Admin')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}