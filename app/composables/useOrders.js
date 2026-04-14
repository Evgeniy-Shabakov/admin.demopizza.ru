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
    lastPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  const perPageOptions = [15, 30, 50, 100]

  const fetchActiveOrders = async (cityId = null, restaurantId = null) => {
    loadingState.value = true
    errorState.value = null
    try {
      const params = new URLSearchParams()
      params.append('active', 'true')
      params.append('perPage', '100')
      if (cityId) params.append('cityId', cityId)
      if (restaurantId) params.append('restaurantId', restaurantId)
      const response = await api.get(`/orders?${params.toString()}`)
      ordersState.value = response.data.data
    } catch (e) {
      errorState.value = getErrorMessage('fetchOrders')
      showError({ message: getErrorMessage('fetchOrders'), details: getErrorDetails(e), statusCode: getStatusCode(e) })
    } finally {
      loadingState.value = false
    }
  }

  const fetchAllOrders = async (page = 1, perPage = null) => {
    if (perPage !== null) {
      allOrdersPagination.value.perPage = perPage
      page = 1
    }
    const perPageValue = allOrdersPagination.value.perPage
    allOrdersLoading.value = true
    try {
      const response = await api.get(`/orders?sort=id,desc&page=${page}&perPage=${perPageValue}`)
      allOrdersState.value = response.data.data
      const pagination = response.data.meta?.pagination || response.data.pagination || {}
      allOrdersPagination.value = {
        currentPage: pagination.page || 1,
        perPage: pagination.perPage || 15,
        total: pagination.total || 0,
        lastPage: pagination.totalPages || 1,
        hasNextPage: pagination.hasNextPage || false,
        hasPrevPage: pagination.hasPrevPage || false
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
    perPageOptions,
    fetchAllOrders
  }
}