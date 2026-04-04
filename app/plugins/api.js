import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl
  const { setConnected, pulse } = useConnectionStatus()

  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
  })

  api.interceptors.request.use((config) => {
    pulse()
    return config
  })

  api.interceptors.response.use(
    (response) => {
      setConnected(true)
      return response
    },
    async (error) => {
      const originalRequest = error.config

      if (!error.response) {
        setConnected(false)
      } else if (error.response?.status === 401) {
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