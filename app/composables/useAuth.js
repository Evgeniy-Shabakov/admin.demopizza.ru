export function useAuth() {
  const { setAuthenticated } = useAuthState()
  const api = useApi()
  
  const formError = useState('formError', () => null)
  
  const login = async (phone, password) => {
    formError.value = null
    
    try {
      await api.post('/auth/login/employee', {
        phone,
        password
      })
      
      setAuthenticated(true)
      
      return { success: true }
    } catch (e) {
      const errorData = e.response?.data || {}
      const error = {
        message: errorData.message || 'Ошибка входа',
        statusCode: e.response?.status,
        details: errorData ? JSON.stringify(errorData, null, 2) : null
      }
      formError.value = error
      return { success: false, error }
    }
  }
  
  const logout = async () => {
    try {
      await api.delete('/auth/logout/employee')
    } catch (e) {
      console.error('Logout error:', e)
    }
    
    setAuthenticated(false)
    navigateTo('/login')
  }
  
  return {
    login,
    logout
  }
}