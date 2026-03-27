import { useConfig } from '~/config/config.js'

export function useAuth() {
  const { API_BASE_URL } = useConfig()
  
  const user = useState('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  const formError = useState('formError', () => null)
  
  const login = async (phone, password) => {
    formError.value = null
    
    try {
      await $fetch(`${API_BASE_URL}/auth/login/employee`, {
        method: 'POST',
        body: {
          phone,
          password
        },
        credentials: 'include'
      })
      
      isAuthenticated.value = true
      return { success: true }
    } catch (e) {
      const errorData = e.data || {}
      const error = {
        message: errorData.message || 'Ошибка входа',
        statusCode: e.statusCode || e.response?.status,
        details: e.data ? JSON.stringify(e.data, null, 2) : null
      }
      formError.value = error
      return { success: false, error }
    }
  }
  
  const refreshAccessToken = async () => {
    const refreshToken = useCookie('employeeRefreshToken')
    if (!refreshToken.value) return false
    
    try {
      const response = await $fetch(`${API_BASE_URL}/auth/refresh/employee`, {
        method: 'POST',
        body: {
          refresh_token: refreshToken.value
        }
      })
      
      if (response.access_token) {
        const token = useCookie('employeeAccessToken', { maxAge: 60 * 15 })
        token.value = response.access_token
        return true
      }
      return false
    } catch (e) {
      logout()
      return false
    }
  }
  
  const logout = async () => {
    const token = useCookie('employeeAccessToken')
    const refreshToken = useCookie('employeeRefreshToken')
    
    try {
      await $fetch(`${API_BASE_URL}/auth/logout/employee`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    } catch (e) {
      console.error('Logout error:', e)
    }
    
    token.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    user.value = null
    
    navigateTo('/login')
  }
  
  const checkAuth = async () => {
    const token = useCookie('employeeAccessToken')
    if (!token.value) {
      isAuthenticated.value = false
      return false
    }
    
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      isAuthenticated.value = true
      return true
    }
    
    return false
  }
  
  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    login,
    logout,
    checkAuth
  }
}