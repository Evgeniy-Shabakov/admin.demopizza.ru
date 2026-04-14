export const useGlobalCityRestaurant = () => {
  const currentCityId = useState('currentCityId', () => null)
  const currentRestaurantId = useState('currentRestaurantId', () => null)

  if (import.meta.client && !currentCityId.value) {
    const savedCityId = localStorage.getItem('cityId')
    const savedRestaurantId = localStorage.getItem('restaurantId')
    if (savedCityId !== null && savedCityId !== '') {
      currentCityId.value = parseInt(savedCityId)
    }
    if (savedRestaurantId !== null && savedRestaurantId !== '') {
      currentRestaurantId.value = parseInt(savedRestaurantId)
    }
  }

  const setCity = (cityId) => {
    currentCityId.value = cityId
    if (!cityId) {
      currentRestaurantId.value = null
    }
    if (import.meta.client) {
      localStorage.setItem('cityId', cityId ?? '')
    }
  }

  const setRestaurant = (restaurantId) => {
    currentRestaurantId.value = restaurantId
    if (import.meta.client) {
      localStorage.setItem('restaurantId', restaurantId ?? '')
    }
  }

  const clearSelection = () => {
    currentCityId.value = null
    currentRestaurantId.value = null
    if (import.meta.client) {
      localStorage.removeItem('cityId')
      localStorage.removeItem('restaurantId')
    }
  }

  return {
    currentCityId: readonly(currentCityId),
    currentRestaurantId: readonly(currentRestaurantId),
    setCity,
    setRestaurant,
    clearSelection
  }
}