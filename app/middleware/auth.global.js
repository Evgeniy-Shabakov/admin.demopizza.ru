export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/login') return
  
  const isAuthenticated = useState('isAuthenticated')

  if (!isAuthenticated) {
    return navigateTo('/login')
  }
  
  isAuthenticated.value = true
})