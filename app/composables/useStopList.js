const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchStopList: 'Ошибка при получении стоп-листа',
    getStopListItem: 'Ошибка при получении элемента стоп-листа',
    createStopListItem: 'Ошибка при добавлении в стоп-лист',
    updateStopListItem: 'Ошибка при обновлении стоп-листа',
    deleteStopListItem: 'Ошибка при удалении из стоп-листа',
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

const stopListCount = ref(0)

export function useStopList() {
  const { error: showError } = useToast()
  const api = useApi()
  const stopListItems = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchStopListCount = async (restaurantId = null) => {
    try {
      const params = {}
      if (restaurantId) {
        params.restaurantId = restaurantId
      }
      const response = await api.get('/product-restaurants/stop-list-count', { params })
      stopListCount.value = response.data.data
    } catch (e) {
      console.error('Ошибка при получении количества стоп-листа:', e)
    }
  }

  const fetchStopList = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/product-restaurants?include=product,restaurant')
      stopListItems.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchStopList')
      showError({ message: getErrorMessage('fetchStopList'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getStopListItem = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/product-restaurants/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getStopListItem')
      showError({ message: getErrorMessage('getStopListItem'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createStopListItem = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/product-restaurants', data)
      await fetchStopList()
      await fetchStopListCount()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createStopListItem')
      showError({ message: getErrorMessage('createStopListItem'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateStopListItem = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/product-restaurants/${id}`, data)
      await fetchStopList()
      await fetchStopListCount()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateStopListItem')
      showError({ message: getErrorMessage('updateStopListItem'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteStopListItem = async (id) => {
    error.value = null
    try {
      await api.delete(`/product-restaurants/${id}`)
      stopListItems.value = stopListItems.value.filter(item => item.id !== id)
      await fetchStopListCount()
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteStopListItem')
      showError({ message: getErrorMessage('deleteStopListItem'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    stopListItems,
    stopListCount,
    loading,
    error,
    fetchStopList,
    getStopListItem,
    createStopListItem,
    updateStopListItem,
    deleteStopListItem,
    fetchStopListCount
  }
}
