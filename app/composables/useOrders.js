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

const ordersState = ref([])
const loadingState = ref(false)
const errorState = ref(null)

export function useOrders() {
  const { error: showError } = useToast()
  const api = useApi()

  const fetchActiveOrders = async () => {
    loadingState.value = true
    errorState.value = null
    try {
      const response = await api.get('/orders?active=true&perPage=100')
      ordersState.value = response.data.data
    } catch (e) {
      errorState.value = getErrorMessage('fetchOrders')
      showError({ message: getErrorMessage('fetchOrders'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loadingState.value = false
    }
  }

  return {
    orders: ordersState,
    loading: loadingState,
    error: errorState,
    activeOrdersCount: computed(() => ordersState.value.length),
    fetchActiveOrders
  }
}