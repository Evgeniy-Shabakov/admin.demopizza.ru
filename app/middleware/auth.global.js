export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/login') return
  
  const { setAuthenticated, setEmployee } = useAuthState()
  const api = useApi()
  
  try {
    const response = await api.get('/auth/jwt-payload/employee')
    const jwtPayload = response.data.data.jwtPayload
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