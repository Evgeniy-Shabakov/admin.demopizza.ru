import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl

  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
  })

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401) {
        const errorCode = error.response?.data?.code

        if (errorCode === 'JWT_ACCESS_TOKEN_VERIFY_INVALID') {
          try {
            await api.post('/auth/refresh/employee')
            return api(originalRequest)
          } catch (refreshError) {
            const { logout } = useAuth()
            logout()
          }
        }
      }

      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api
    }
  }
})