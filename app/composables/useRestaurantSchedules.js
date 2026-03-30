const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchRestaurantSchedules: 'Ошибка при получении списка графиков работы',
    getRestaurantSchedule: 'Ошибка при получении графика работы',
    createRestaurantSchedule: 'Ошибка при создании графика работы',
    updateRestaurantSchedule: 'Ошибка при обновлении графика работы',
    deleteRestaurantSchedule: 'Ошибка при удалении графика работы',
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

export function useRestaurantSchedules() {
  const { error: showError } = useToast()
  const api = useApi()
  const restaurantSchedules = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRestaurantSchedules = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/restaurant-schedules')
      restaurantSchedules.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchRestaurantSchedules')
      showError({ message: getErrorMessage('fetchRestaurantSchedules'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getRestaurantSchedule = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/restaurant-schedules/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getRestaurantSchedule')
      showError({ message: getErrorMessage('getRestaurantSchedule'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createRestaurantSchedule = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/restaurant-schedules', data)
      await fetchRestaurantSchedules()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createRestaurantSchedule')
      showError({ message: getErrorMessage('createRestaurantSchedule'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateRestaurantSchedule = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/restaurant-schedules/${id}`, data)
      await fetchRestaurantSchedules()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateRestaurantSchedule')
      showError({ message: getErrorMessage('updateRestaurantSchedule'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteRestaurantSchedule = async (id) => {
    error.value = null
    try {
      await api.delete(`/restaurant-schedules/${id}`)
      restaurantSchedules.value = restaurantSchedules.value.filter(s => s.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteRestaurantSchedule')
      showError({ message: getErrorMessage('deleteRestaurantSchedule'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    restaurantSchedules,
    loading,
    error,
    fetchRestaurantSchedules,
    getRestaurantSchedule,
    createRestaurantSchedule,
    updateRestaurantSchedule,
    deleteRestaurantSchedule
  }
}
