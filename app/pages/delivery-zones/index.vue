<script setup>
useHead({
   title: 'Зоны доставки'
})

const router = useRouter()
const { deliveryZones, loading, fetchDeliveryZones, deleteDeliveryZone } = useDeliveryZones()
const { fetchCities, cities } = useCities()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess } = useToast()

onMounted(() => {
   fetchDeliveryZones()
   fetchCities()
   fetchRestaurants()
})

const handleRowClick = (id) => {
   router.push(`/delivery-zones/${id}`)
}

const handleDelete = async (item) => {
   const result = await deleteDeliveryZone(item.id)
   if (result) {
      showSuccess('Зона доставки успешно удалена')
   }
}

const getCityName = (cityId) => {
   const city = cities.value.find(c => c.id === cityId)
   return city?.name || '—'
}

const getRestaurantName = (restaurantId) => {
   const restaurant = restaurants.value.find(r => r.id === restaurantId)
   return restaurant?.name || '—'
}

const formatPrice = (value) => {
   if (value === null || value === undefined) return '—'
   return `${value} ₽`
}

const columns = [
   { key: 'id', label: 'ID' },
   { key: 'name', label: 'Название', bold: true },
   {
       key: 'isActive',
       label: 'Активна',
       align: 'center',
       mobileLabel: 'Статус',
       render: (item) => item.isActive
          ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span>'
          : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span>'
    },
    {
       key: 'hasGeoJson',
       label: 'Карта',
       align: 'center',
       mobileLabel: 'Карта',
       render: (item) => item.geojsonFeature
          ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg></span>'
          : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg></span>'
    },
   { key: 'city', label: 'Город', render: (item) => getCityName(item.cityId), mobileLabel: 'Город' },
   { key: 'restaurant', label: 'Ресторан', render: (item) => getRestaurantName(item.restaurantId), mobileLabel: 'Ресторан' },
   { key: 'deliveryPrice', label: 'Стоимость доставки', render: (item) => formatPrice(item.deliveryPrice), mobileLabel: 'Доставка' },
   { key: 'minOrderValueForDelivery', label: 'Мин. заказ', render: (item) => formatPrice(item.minOrderValueForDelivery), mobileLabel: 'Мин. заказ' },
   { key: 'orderValueForFreeDelivery', label: 'Бесплатная от', render: (item) => formatPrice(item.orderValueForFreeDelivery), mobileLabel: 'Бесплатная' },
   { key: 'createdAt', label: 'Создано', showInMobile: false },
   { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
   { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
   <UiListTable :items="deliveryZones"
                :columns="columns"
                :loading="loading"
                empty-text="Зоны доставки не найдены"
                view-link-prefix="/delivery-zones"
                edit-link-prefix="/delivery-zones"
                delete-label="зону доставки"
                @row-click="handleRowClick"
                @delete="handleDelete" />
</template>
