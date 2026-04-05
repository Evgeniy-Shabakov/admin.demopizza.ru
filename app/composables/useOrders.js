const getErrorMessage = (operation) => {
  const errorMessages = {
    fetchOrders: 'Ошибка при получении заказов',
    fetchAllOrders: 'Ошибка при получении всех заказов',
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

const ordersState = useState('orders', () => [])
const loadingState = useState('ordersLoading', () => false)
const errorState = useState('ordersError', () => null)

export function useOrders() {
  const { error: showError } = useToast()
  const api = useApi()

  const allOrdersState = ref([])
  const allOrdersLoading = ref(false)
  const allOrdersPagination = ref({
    currentPage: 1,
    perPage: 15,
    total: 0,
    lastPage: 1
  })

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

  const fetchAllOrders = async (page = 1) => {
    allOrdersLoading.value = true
    try {
      const response = await api.get(`/orders?sort=id,desc&page=${page}&perPage=15`)
      allOrdersState.value = response.data.data
      const pagination = response.data.meta?.pagination || response.data.pagination || {}
      allOrdersPagination.value = {
        currentPage: pagination.page || 1,
        perPage: pagination.perPage || 15,
        total: pagination.total || 0,
        lastPage: pagination.totalPages || 1
      }
    } catch (e) {
      showError({ message: getErrorMessage('fetchAllOrders'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      allOrdersLoading.value = false
    }
  }

  return {
    orders: ordersState,
    loading: loadingState,
    error: errorState,
    activeOrdersCount: computed(() => ordersState.value.length),
    fetchActiveOrders,
    allOrders: allOrdersState,
    allOrdersLoading,
    allOrdersPagination,
    fetchAllOrders
  }
}