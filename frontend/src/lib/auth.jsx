import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import api from './api'
import { Spinner } from '../components/ui'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    api.get('/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setChecking(false))
  }, [])

  const saveSession = ({ user, token }) => {
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logout = async () => {
    await api.post('/logout').catch(() => {})
    localStorage.removeItem('token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, checking, saveSession, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export const homePath = (user) => (user.role === 'umkm' ? '/app' : '/app/pengajuan')

/** Route guard: requires a session, and optionally one of the given roles. */
export function RequireRole({ roles }) {
  const { user, checking } = useAuth()
  const location = useLocation()

  if (checking) return <div className="grid min-h-screen place-items-center"><Spinner className="size-8 text-shu" /></div>
  if (!user) return <Navigate to="/masuk" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to={homePath(user)} replace />
  return <Outlet />
}
