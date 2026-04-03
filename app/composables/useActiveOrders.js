const activeOrdersCount = ref(0)

export function useActiveOrders() {
  const { error: showError } = useToast()
  const api = useApi()

  const fetchActiveOrdersCount = async () => {
    try {
      const response = await api.get('/orders/active-count')
      activeOrdersCount.value = response.data.data
    } catch (e) {
      console.error('Ошибка при получении количества активных заказов:', e)
    }
  }

  return {
    activeOrdersCount,
    fetchActiveOrdersCount
  }
}