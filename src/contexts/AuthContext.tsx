import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface User {
  email: string;
  // Add other user properties if needed
}

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (user: User) => void; // Modify login to accept a user object
  logout: () => void;
  user: User | null; // Add user property
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedAuth = localStorage.getItem('isAuthenticated')
    if (storedUser && storedAuth === 'true') {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
  }
  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}