import axios from 'axios'

let isRefreshing = false
let pendingQueue = []

const REFRESH_MAX_RETRIES = 2
const REFRESH_RETRY_DELAY = 300

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const processQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  pendingQueue = []
}

const refreshTokenWithRetry = async (api) => {
  let lastError
  for (let attempt = 0; attempt <= REFRESH_MAX_RETRIES; attempt++) {
    try {
      await api.post('/auth/refresh')
      return
    } catch (err) {
      lastError = err
      if (attempt < REFRESH_MAX_RETRIES) {
        await sleep(REFRESH_RETRY_DELAY * (attempt + 1))
      }
    }
  }
  throw lastError
}

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
        return Promise.reject(error)
      }

      if (error.response?.status === 401) {
        const code = error.response?.data?.code
        const isExpired = code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED'
        const isRefreshRequest = originalRequest.url === '/auth/refresh'

        if (isExpired && !originalRequest._retry && !isRefreshRequest) {
          if (isRefreshing) {
            try {
              await new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject })
              })
              return api(originalRequest)
            } catch (e) {
              return Promise.reject(e)
            }
          }

          originalRequest._retry = true
          isRefreshing = true

          try {
            await refreshTokenWithRetry(api)
            processQueue(null)
            return api(originalRequest)
          } catch (refreshError) {
            processQueue(refreshError)
            const { logout } = useAuth()
            logout()
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
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