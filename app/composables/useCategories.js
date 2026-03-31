const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchCategories: 'Ошибка при получении списка категорий',
    getCategory: 'Ошибка при получении категории',
    createCategory: 'Ошибка при создании категории',
    updateCategory: 'Ошибка при обновлении категории',
    deleteCategory: 'Ошибка при удалении категории',
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

export function useCategories() {
  const { error: showError } = useToast()
  const api = useApi()
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/categories')
      categories.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchCategories')
      showError({ message: getErrorMessage('fetchCategories'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getCategory = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getCategory')
      showError({ message: getErrorMessage('getCategory'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/categories', data)
      await fetchCategories()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createCategory')
      showError({ message: getErrorMessage('createCategory'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/categories/${id}`, data)
      await fetchCategories()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateCategory')
      showError({ message: getErrorMessage('updateCategory'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    error.value = null
    try {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter(c => c.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteCategory')
      showError({ message: getErrorMessage('deleteCategory'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  const sortedCategories = computed(() => {
    const positioned = categories.value.filter(c => c.position !== null && c.position !== undefined)
    const unpositioned = categories.value.filter(c => c.position === null || c.position === undefined)
    
    const maxPosition = positioned.length > 0 
      ? Math.max(...positioned.map(c => c.position)) 
      : 0
    
    const result = new Array(Math.max(maxPosition, 0)).fill(null)
    
    positioned.forEach(c => {
      if (c.position > 0 && c.position <= result.length) {
        result[c.position - 1] = c
      }
    })
    
    let unposIndex = 0
    for (let i = 0; i < result.length && unposIndex < unpositioned.length; i++) {
      if (result[i] === null) {
        result[i] = unpositioned[unposIndex]
        unposIndex++
      }
    }
    
    while (unposIndex < unpositioned.length) {
      result.push(unpositioned[unposIndex])
      unposIndex++
    }
    
    return result
  })

  return {
    categories,
    sortedCategories,
    loading,
    error,
    fetchCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
