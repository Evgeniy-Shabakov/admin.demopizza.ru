const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchRestaurants: 'Ошибка при получении списка ресторанов',
    getRestaurant: 'Ошибка при получении ресторана',
    createRestaurant: 'Ошибка при создании ресторана',
    updateRestaurant: 'Ошибка при обновлении ресторана',
    deleteRestaurant: 'Ошибка при удалении ресторана',
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

export function useRestaurants() {
  const { error: showError } = useToast()
  const api = useApi()
  const restaurants = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRestaurants = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/restaurants')
      restaurants.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchRestaurants')
      showError({ message: getErrorMessage('fetchRestaurants'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getRestaurant = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/restaurants/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getRestaurant')
      showError({ message: getErrorMessage('getRestaurant'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createRestaurant = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/restaurants', data)
      await fetchRestaurants()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createRestaurant')
      showError({ message: getErrorMessage('createRestaurant'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateRestaurant = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/restaurants/${id}`, data)
      await fetchRestaurants()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateRestaurant')
      showError({ message: getErrorMessage('updateRestaurant'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteRestaurant = async (id) => {
    error.value = null
    try {
      await api.delete(`/restaurants/${id}`)
      restaurants.value = restaurants.value.filter(r => r.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteRestaurant')
      showError({ message: getErrorMessage('deleteRestaurant'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
  }
}
