export const useAuthState = () => {
  const employee = useState('employee', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  
  return {
    employee: readonly(employee),
    isAuthenticated: readonly(isAuthenticated),
    setEmployee: (value) => { employee.value = value },
    setAuthenticated: (value) => { isAuthenticated.value = value }
  }
}