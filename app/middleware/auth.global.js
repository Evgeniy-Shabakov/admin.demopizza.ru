export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') return
  
  const token = useCookie('employeeAccessToken')
  const refreshToken = useCookie('employeeRefreshToken')
  
  if (!token.value && !refreshToken.value) {
    return navigateTo('/login')
  }
})