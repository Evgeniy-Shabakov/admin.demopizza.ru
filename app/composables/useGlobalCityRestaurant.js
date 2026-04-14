export const useGlobalCityRestaurant = () => {
  const currentCityId = useState('currentCityId', () => null)
  const currentRestaurantId = useState('currentRestaurantId', () => null)

  const setCity = (cityId) => {
    currentCityId.value = cityId
    if (!cityId) {
      currentRestaurantId.value = null
    }
  }

  const setRestaurant = (restaurantId) => {
    currentRestaurantId.value = restaurantId
  }

  const clearSelection = () => {
    currentCityId.value = null
    currentRestaurantId.value = null
  }

  return {
    currentCityId: readonly(currentCityId),
    currentRestaurantId: readonly(currentRestaurantId),
    setCity,
    setRestaurant,
    clearSelection
  }
}