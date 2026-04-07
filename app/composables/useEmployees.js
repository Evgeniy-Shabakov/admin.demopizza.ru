const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchEmployees: 'Ошибка при получении списка сотрудников',
    getEmployee: 'Ошибка при получении сотрудника',
    createEmployee: 'Ошибка при создании сотрудника',
    updateEmployee: 'Ошибка при обновлении сотрудника',
    deleteEmployee: 'Ошибка при удалении сотрудника',
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

export function useEmployees() {
  const { error: showError } = useToast()
  const api = useApi()
  const employees = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchEmployees = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/employees')
      employees.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchEmployees')
      showError({ message: getErrorMessage('fetchEmployees'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  const getEmployee = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/employees/${id}`)
      return response.data.data
    } catch (e) {
      error.value = getErrorMessage('getEmployee')
      showError({ message: getErrorMessage('getEmployee'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return null
    } finally {
      loading.value = false
    }
  }

  const createEmployee = async (data) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/employees', data)
      await fetchEmployees()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('createEmployee')
      showError({ message: getErrorMessage('createEmployee'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const updateEmployee = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/employees/${id}`, data)
      await fetchEmployees()
      return { success: true }
    } catch (e) {
      const validationMsg = getValidationMessage(e)
      error.value = validationMsg || getErrorMessage('updateEmployee')
      showError({ message: getErrorMessage('updateEmployee'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return { success: false, validationError: validationMsg }
    } finally {
      loading.value = false
    }
  }

  const deleteEmployee = async (id) => {
    error.value = null
    try {
      await api.delete(`/employees/${id}`)
      employees.value = employees.value.filter(emp => emp.id !== id)
      return true
    } catch (e) {
      error.value = getErrorMessage('deleteEmployee')
      showError({ message: getErrorMessage('deleteEmployee'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
      return false
    }
  }

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}
