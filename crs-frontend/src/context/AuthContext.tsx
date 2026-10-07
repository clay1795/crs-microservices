import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { LoginResponse } from '../types/auth'

type AuthUser = Pick<LoginResponse, 'username' | 'role'>

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (data: LoginResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function restoreUser(): AuthUser | null {
  try {
    const token = localStorage.getItem('crs_token')
    const savedUser = localStorage.getItem('crs_user')
    if (token && savedUser) {
      const user: unknown = JSON.parse(savedUser)
      if (typeof user === 'object' && user !== null && 'username' in user && 'role' in user
        && typeof user.username === 'string' && (user.role === 'ADMIN' || user.role === 'STUDENT')) {
        return { username: user.username, role: user.role }
      }
    }
  } catch {
    // Invalid saved data must not prevent the login page from opening.
  }
  localStorage.removeItem('crs_token')
  localStorage.removeItem('crs_user')
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(restoreUser)

  const login = (data: LoginResponse) => {
    const authUser = { username: data.username, role: data.role }
    localStorage.setItem('crs_token', data.token)
    localStorage.setItem('crs_user', JSON.stringify(authUser))
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem('crs_token')
    localStorage.removeItem('crs_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth phải được dùng trong AuthProvider')
  return context
}
