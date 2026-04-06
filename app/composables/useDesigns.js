const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchDesigns: 'Ошибка при получении списка дизайнов',
    getDesign: 'Ошибка при получении дизайна',
    createDesign: 'Ошибка при создании дизайна',
    updateDesign: 'Ошибка при обновлении дизайна',
    deleteDesign: 'Ошибка при удалении дизайна',
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

export function useDesigns() {
  const { error: showError } = useToast()
  const api = useApi()
  const designs = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchDesigns = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/designs')
      designs.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchDesigns')
      showError({ message: getErrorMessage('fetchDesigns'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getDesign = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/designs/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getDesign')
      showError({ message: getErrorMessage('getDesign'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createDesign = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/designs', data)
      await fetchDesigns()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createDesign')
      showError({ message: getErrorMessage('createDesign'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateDesign = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/designs/${id}`, data)
      await fetchDesigns()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateDesign')
      showError({ message: getErrorMessage('updateDesign'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteDesign = async (id) => {
    error.value = null
    try {
      await api.delete(`/designs/${id}`)
      designs.value = designs.value.filter(d => d.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteDesign')
      showError({ message: getErrorMessage('deleteDesign'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    designs,
    loading,
    error,
    fetchDesigns,
    getDesign,
    createDesign,
    updateDesign,
    deleteDesign
  }
}