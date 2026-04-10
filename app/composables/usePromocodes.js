const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchPromocodes: 'Ошибка при получении промокодов',
    getPromocode: 'Ошибка при получении промокода',
    createPromocode: 'Ошибка при создании промокода',
    updatePromocode: 'Ошибка при обновлении промокода',
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

export function usePromocodes() {
  const { error: showError } = useToast()
  const api = useApi()
  
  const promocodes = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const pagination = ref({
    currentPage: 1,
    perPage: 15,
    total: 0,
    lastPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  const perPageOptions = [15, 30, 50, 100]

  const fetchPromocodes = async (page = 1, perPage = null) => {
    if (perPage !== null) {
      pagination.value.perPage = perPage
      page = 1
    }
    const perPageValue = pagination.value.perPage
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/promocodes?sort=id,desc&page=${page}&perPage=${perPageValue}`)
      promocodes.value = response.data.data
      const pag = response.data.meta?.pagination || response.data.pagination || {}
      pagination.value = {
        currentPage: pag.page || 1,
        perPage: pag.perPage || 15,
        total: pag.total || 0,
        lastPage: pag.totalPages || 1,
        hasNextPage: pag.hasNextPage || false,
        hasPrevPage: pag.hasPrevPage || false
      }
    } catch (e) {
      error.value = getErrorMessage('fetchPromocodes')
      showError({ message: getErrorMessage('fetchPromocodes'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getPromocode = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/promocodes/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getPromocode')
      showError({ message: getErrorMessage('getPromocode'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createPromocode = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/promocodes', data)
      await fetchPromocodes()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createPromocode')
      showError({ message: getErrorMessage('createPromocode'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updatePromocode = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.patch(`/promocodes/${id}`, data)
      await fetchPromocodes()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updatePromocode')
      showError({ message: getErrorMessage('updatePromocode'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  return {
    promocodes,
    loading,
    error,
    pagination,
    perPageOptions,
    fetchPromocodes,
    getPromocode,
    createPromocode,
    updatePromocode
  }
}