const getErrorMessage = (operation) => {
  const errorMessages = {
    getCompany: 'Ошибка при получении данных компании',
    updateCompany: 'Ошибка при обновлении данных компании',
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

export function useCompany() {
  const { error: showError } = useToast()
  const api = useApi()
  const company = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getCompanyData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/company')
      const data = response.data.data
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')
      
      if (data.logoPath) {
        data.logoUrl = data.logoPath.replace('storage/public', apiBaseUrl)
      }
      if (data.faviconPath) {
        data.faviconUrl = data.faviconPath.replace('storage/public', apiBaseUrl)
      }
      
      return data
    } catch (e) {
      error.value = getErrorMessage('getCompany')
      showError({ message: getErrorMessage('getCompany'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const updateCompanyData = async (data) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('name', data.name || '')
      formData.append('brandName', data.brandName || '')
      formData.append('tagline', data.tagline || '')
      formData.append('phoneForOrders', data.phoneForOrders || '')
      formData.append('aboutUs', data.aboutUs || '')
      formData.append('contacts', data.contacts || '')
      formData.append('linksSocial', data.linksSocial || '')
      formData.append('isBonusCoinsEnabled', data.isBonusCoinsEnabled ? '1' : '0')
      
      if (data.logoFile) {
        formData.append('logoFile', data.logoFile)
      }
      if (data.faviconFile) {
        formData.append('faviconFile', data.faviconFile)
      }

      await api.put('/company', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateCompany')
      showError({ message: getErrorMessage('updateCompany'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  return {
    company,
    loading,
    error,
    getCompanyData,
    updateCompanyData
  }
}
