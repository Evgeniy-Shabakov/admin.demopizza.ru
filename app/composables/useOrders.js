const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchOrders: 'Ошибка при получении заказов',
  }
  return errorMessages[operation] || 'Произошла ошибка'
}

const getErrorDetails = (e) => {
  const status = e.response?.status
  const data = e.response?.data
  if (!data && !status) return null
  return data ? JSON.stringify(data, null, 2) : null
}

const getStatusCode = (e) => e.response?.status || null

export function useOrders() {
  const { error: showError } = useToast()
  const api = useApi()
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchActiveOrders = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/orders?active=true')
      orders.value = response.data.data
    } catch (e) {
      error.value = getErrorMessage('fetchOrders')
      showError({ message: getErrorMessage('fetchOrders'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    loading,
    error,
    fetchActiveOrders
  }
}