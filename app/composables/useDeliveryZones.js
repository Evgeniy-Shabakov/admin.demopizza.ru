const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchDeliveryZones: 'Ошибка при получении списка зон доставки',
    getDeliveryZone: 'Ошибка при получении зоны доставки',
    createDeliveryZone: 'Ошибка при создании зоны доставки',
    updateDeliveryZone: 'Ошибка при обновлении зоны доставки',
    deleteDeliveryZone: 'Ошибка при удалении зоны доставки',
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

export function useDeliveryZones() {
  const { error: showError } = useToast()
  const api = useApi()
  const deliveryZones = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchDeliveryZones = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/delivery-zones')
      deliveryZones.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchDeliveryZones')
      showError({ message: getErrorMessage('fetchDeliveryZones'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getDeliveryZone = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/delivery-zones/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getDeliveryZone')
      showError({ message: getErrorMessage('getDeliveryZone'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createDeliveryZone = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/delivery-zones', data)
      await fetchDeliveryZones()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createDeliveryZone')
      showError({ message: getErrorMessage('createDeliveryZone'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateDeliveryZone = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/delivery-zones/${id}`, data)
      await fetchDeliveryZones()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateDeliveryZone')
      showError({ message: getErrorMessage('updateDeliveryZone'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteDeliveryZone = async (id) => {
    error.value = null
    try {
      await api.delete(`/delivery-zones/${id}`)
      deliveryZones.value = deliveryZones.value.filter(dz => dz.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteDeliveryZone')
      showError({ message: getErrorMessage('deleteDeliveryZone'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    deliveryZones,
    loading,
    error,
    fetchDeliveryZones,
    getDeliveryZone,
    createDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone
  }
}
