const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchCities: 'Ошибка при получении списка городов',
    getCity: 'Ошибка при получении города',
    createCity: 'Ошибка при создании города',
    updateCity: 'Ошибка при обновлении города',
    deleteCity: 'Ошибка при удалении города',
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

export function useCities() {
  const { error: showError } = useToast()
  const api = useApi()
  const cities = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCities = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/cities')
      cities.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchCities')
      showError({ message: getErrorMessage('fetchCities'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getCity = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/cities/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getCity')
      showError({ message: getErrorMessage('getCity'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createCity = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/cities', data)
      await fetchCities()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createCity')
      showError({ message: getErrorMessage('createCity'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateCity = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/cities/${id}`, data)
      await fetchCities()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateCity')
      showError({ message: getErrorMessage('updateCity'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteCity = async (id) => {
    error.value = null
    try {
      await api.delete(`/cities/${id}`)
      cities.value = cities.value.filter(c => c.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteCity')
      showError({ message: getErrorMessage('deleteCity'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    cities,
    loading,
    error,
    fetchCities,
    getCity,
    createCity,
    updateCity,
    deleteCity
  }
}
