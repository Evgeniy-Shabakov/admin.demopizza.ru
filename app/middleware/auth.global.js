export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/login') return
  
  const { setAuthenticated, setEmployee } = useAuthState()
  const api = useApi()
  
  try {
    const response = await api.get('/auth/token-info')
    const jwtPayload = response.data.data
    const employee = {
      id: jwtPayload.id,
      phone: jwtPayload.phone,
      employeeRoles: jwtPayload.employeeRoles
    }
    setEmployee(employee)
    setAuthenticated(true)
  } catch (e) {
    setAuthenticated(false)
    setEmployee(null)
    return navigateTo('/login')
  }
})