const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchProducts: 'Ошибка при получении списка товаров',
    getProduct: 'Ошибка при получении товара',
    createProduct: 'Ошибка при создании товара',
    updateProduct: 'Ошибка при обновлении товара',
    deleteProduct: 'Ошибка при удалении товара',
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

export function useProducts() {
  const { error: showError } = useToast()
  const api = useApi()
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/products?include=category')
      products.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchProducts')
      showError({ message: getErrorMessage('fetchProducts'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getProduct = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/products/${id}`)
      const product = response.data.data
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')
      
      if (product.imagePath) {
        product.imageUrl = product.imagePath.replace('storage/public', apiBaseUrl)
      }
      
      return product
    } catch (e) {
      error.value = getErrorMessage('getProduct')
      showError({ message: getErrorMessage('getProduct'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (data) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('categoryId', data.categoryId)
      formData.append('priceDefault', data.priceDefault)
      formData.append('bonusCoinsDefault', data.bonusCoinsDefault || 0)
      formData.append('descriptionShort', data.descriptionShort || '')
      formData.append('descriptionFull', data.descriptionFull || '')
      formData.append('positionInCategory', data.positionInCategory ? Number(data.positionInCategory) : null)
      formData.append('isActive', data.isActive ? '1' : '0')
      
      if (data.imageFile) {
        formData.append('imageFile', data.imageFile)
      }

      await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchProducts()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createProduct')
      showError({ message: getErrorMessage('createProduct'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('categoryId', data.categoryId)
      formData.append('priceDefault', data.priceDefault)
      formData.append('bonusCoinsDefault', data.bonusCoinsDefault || 0)
      formData.append('descriptionShort', data.descriptionShort || '')
      formData.append('descriptionFull', data.descriptionFull || '')
      formData.append('positionInCategory', data.positionInCategory ? Number(data.positionInCategory) : null)
      formData.append('isActive', data.isActive ? '1' : '0')
      
      if (data.imageFile) {
        formData.append('imageFile', data.imageFile)
      }

      await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchProducts()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateProduct')
      showError({ message: getErrorMessage('updateProduct'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id) => {
    error.value = null
    try {
      await api.delete(`/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteProduct')
      showError({ message: getErrorMessage('deleteProduct'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  const sortedProducts = computed(() => {
    const positioned = products.value.filter(p => p.positionInCategory !== null && p.positionInCategory !== undefined)
    const unpositioned = products.value.filter(p => p.positionInCategory === null || p.positionInCategory === undefined)
    
    const maxPosition = positioned.length > 0 
      ? Math.max(...positioned.map(p => p.positionInCategory)) 
      : 0
    
    const result = new Array(Math.max(maxPosition, 0)).fill(null)
    
    positioned.forEach(p => {
      if (p.positionInCategory > 0 && p.positionInCategory <= result.length) {
        result[p.positionInCategory - 1] = p
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
    products,
    sortedProducts,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
