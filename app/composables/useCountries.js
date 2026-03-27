import { useConfig } from '~/config/config.js'

const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchCountries: 'Ошибка при получении списка стран',
    getCountry: 'Ошибка при получении страны',
    createCountry: 'Ошибка при создании страны',
    updateCountry: 'Ошибка при обновлении страны',
    deleteCountry: 'Ошибка при удалении страны',
  }
  return errorMessages[operation] || 'Произошла ошибка'
}

const getErrorDetails = (e) => {
  const status = e.statusCode || e.response?.status
  const data = e.data || e.response?.data
  if (!data && !status) return null
  return data ? JSON.stringify(data, null, 2) : null
}

const getStatusCode = (e) => e.statusCode || e.response?.status || null

export function useCountries() {
  const { API_BASE_URL } = useConfig()
  const { error: showError } = useToast()
  const countries = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCountries = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch(`${API_BASE_URL}/countries`)
      countries.value = response.data
    } catch (e) {
      error.value = getErrorMessage('fetchCountries')
      showError({ message: getErrorMessage('fetchCountries'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getCountry = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch(`${API_BASE_URL}/countries/${id}`)
      return response.data
    } catch (e) {
      error.value = getErrorMessage('getCountry')
      showError({ message: getErrorMessage('getCountry'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createCountry = async (name) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`${API_BASE_URL}/countries`, {
        method: 'POST',
        body: { name }
      })
      await fetchCountries()
      return true
    } catch (e) {
      error.value = getErrorMessage('createCountry')
      showError({ message: getErrorMessage('createCountry'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    } finally {
      loading.value = false
    }
  }

  const updateCountry = async (id, name) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`${API_BASE_URL}/countries/${id}`, {
        method: 'PUT',
        body: { name }
      })
      await fetchCountries()
      return true
    } catch (e) {
      error.value = getErrorMessage('updateCountry')
      showError({ message: getErrorMessage('updateCountry'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteCountry = async (id) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`${API_BASE_URL}/countries/${id}`, {
        method: 'DELETE'
      })
      await fetchCountries()
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteCountry')
      showError({ message: getErrorMessage('deleteCountry'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    countries,
    loading,
    error,
    fetchCountries,
    getCountry,
    createCountry,
    updateCountry,
    deleteCountry
  }
}
