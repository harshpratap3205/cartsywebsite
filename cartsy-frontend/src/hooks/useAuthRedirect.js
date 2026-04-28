import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/auth/authSlice'

export const useAuthRedirect = (redirectTo = '/') => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo)
  }, [isAuthenticated, navigate, redirectTo])
}