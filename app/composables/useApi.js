export const useApi = () => {
  const { $api: api } = useNuxtApp()
  return api
}