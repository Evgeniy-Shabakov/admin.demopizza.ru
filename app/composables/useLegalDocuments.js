const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchLegalDocuments: 'Ошибка при получении списка правовых документов',
    getLegalDocument: 'Ошибка при получении правового документа',
    createLegalDocument: 'Ошибка при создании правового документа',
    updateLegalDocument: 'Ошибка при обновлении правового документа',
    deleteLegalDocument: 'Ошибка при удалении правового документа',
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

export function useLegalDocuments() {
  const { error: showError } = useToast()
  const api = useApi()
  const legalDocuments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchLegalDocuments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/legal-documents')
      legalDocuments.value = response.data.data.map(doc => ({
        ...doc,
        docFile: doc.file_path || doc.docFile || null
      }))
    } catch (e) {
      error.value = getErrorMessage('fetchLegalDocuments')
      showError({ message: getErrorMessage('fetchLegalDocuments'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getLegalDocument = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/legal-documents/${id}`)
      const doc = response.data.data
      const config = useRuntimeConfig()
      const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')
      
      if (doc.docFile || doc.file_path || doc.filePath) {
        doc.docFileUrl = (doc.filePath || doc.file_path || doc.docFile).replace('storage/public', apiBaseUrl)
      }
      
      return doc
    } catch (e) {
      error.value = getErrorMessage('getLegalDocument')
      showError({ message: getErrorMessage('getLegalDocument'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createLegalDocument = async (data) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.link) {
        formData.append('link', data.link)
      }
      formData.append('isActive', data.isActive ? '1' : '0')
      
      if (data.docFile) {
        formData.append('docFile', data.docFile)
      }

      await api.post('/legal-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchLegalDocuments()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createLegalDocument')
      showError({ message: getErrorMessage('createLegalDocument'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateLegalDocument = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.link) {
        formData.append('link', data.link)
      }
      formData.append('isActive', data.isActive ? '1' : '0')
      
      if (data.docFile) {
        formData.append('docFile', data.docFile)
      }

      await api.put(`/legal-documents/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchLegalDocuments()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateLegalDocument')
      showError({ message: getErrorMessage('updateLegalDocument'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteLegalDocument = async (id) => {
    error.value = null
    try {
      await api.delete(`/legal-documents/${id}`)
      legalDocuments.value = legalDocuments.value.filter(d => d.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteLegalDocument')
      showError({ message: getErrorMessage('deleteLegalDocument'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    legalDocuments,
    loading,
    error,
    fetchLegalDocuments,
    getLegalDocument,
    createLegalDocument,
    updateLegalDocument,
    deleteLegalDocument
  }
}
