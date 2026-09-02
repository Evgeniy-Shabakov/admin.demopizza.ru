export const useAuthState = () => {
  const employee = useState('employee', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  const api = useApi()

  const fetchCurrentUser = async () => {
    if (!employee.value?.id) return
    try {
      const response = await api.get(`/employees/${employee.value.id}`)
      employee.value = response.data.data
    } catch (e) {
      console.error('Error fetching current user:', e)
    }
  }

  return {
    employee: readonly(employee),
    isAuthenticated: readonly(isAuthenticated),
    setEmployee: (value) => { employee.value = value },
    setAuthenticated: (value) => { isAuthenticated.value = value },
    fetchCurrentUser
  }
}