export const useConfig = () => {
  const config = useRuntimeConfig()
  return {
    API_BASE_URL: config.public.apiBaseUrl
  }
}