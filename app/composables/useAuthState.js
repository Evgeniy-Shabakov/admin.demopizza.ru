export const useAuthState = () => {
  const user = useState('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    setUser: (value) => { user.value = value },
    setAuthenticated: (value) => { isAuthenticated.value = value }
  }
}