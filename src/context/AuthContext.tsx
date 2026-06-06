import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthUser } from '@/types/auth.types'
import { getToken, saveToken, removeToken, decodeToken } from '@/utils/token'
import { login as loginApi } from '@/api/auth'
import { mockLogin } from '@/api/mock'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Al montar, revisar si ya hay token guardado
  useEffect(() => {
    const token = getToken()
    if (token) {
      const decoded = decodeToken(token)
      setUser(decoded)
    }
    setIsLoading(false)
  }, [])

  /*const login = async (username: string, password: string) => {
    const { token } = await mockLogin(username, password)
    saveToken(token)
    const decoded = decodeToken(token)
    setUser(decoded)
  }*/

  const login = async (username: string, password: string) => {
    const { token } = await loginApi({ username, password })
    saveToken(token)
    const decoded = decodeToken(token)
    setUser(decoded)
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}