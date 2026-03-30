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
  const status = e.response?.status
  const data = e.response?.data
  if (!data && !status) return null
  return data ? JSON.stringify(data, null, 2) : null
}

const getValidationMessage = (e) => {
  const data = e.response?.data
  if (!data) return null
  
  if (data.message) {
    return data.message
  }
  
  if (data.errors) {
    const errors = data.errors
    const firstKey = Object.keys(errors)[0]
    if (firstKey && errors[firstKey]) {
      return Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey]
    }
  }
  
  return null
}

const getStatusCode = (e) => e.response?.status || null

export function useCountries() {
  const { error: showError } = useToast()
  const api = useApi()
  const countries = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCountries = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/countries')
      countries.value = response.data.data
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
      const response = await api.get(`/countries/${id}`)
      return response.data.data
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
      await api.post('/countries', { name })
      await fetchCountries()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createCountry')
      showError({ message: getErrorMessage('createCountry'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateCountry = async (id, name) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/countries/${id}`, { name })
      await fetchCountries()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateCountry')
      showError({ message: getErrorMessage('updateCountry'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteCountry = async (id) => {
    error.value = null
    try {
      await api.delete(`/countries/${id}`)
      countries.value = countries.value.filter(c => c.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteCountry')
      showError({ message: getErrorMessage('deleteCountry'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
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