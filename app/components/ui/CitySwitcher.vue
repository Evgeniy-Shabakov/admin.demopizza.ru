<script setup>
import BaseModal from '~/components/base/BaseModal.vue'
import BaseLabel from '~/components/base/BaseLabel.vue'
import BaseButton from '~/components/base/BaseButton.vue'

const { cities, fetchCities } = useCities()
const { restaurants, fetchRestaurants } = useRestaurants()
const { currentCityId, currentRestaurantId, setCity, setRestaurant } = useGlobalCityRestaurant()

const selectedCityName = computed(() => {
   if (!currentCityId.value) return 'Все города'
   const city = cities.value.find(c => c.id === currentCityId.value)
   return city?.name || 'Все города'
})

const selectedRestaurantName = computed(() => {
   if (!currentRestaurantId.value) return 'Все рестораны'
   const restaurant = restaurants.value.find(r => r.id === currentRestaurantId.value)
   return restaurant?.name || 'Все рестораны'
})

const showModal = ref(false)
const selectedCity = ref(null)
const selectedRestaurant = ref(null)

onMounted(() => {
   selectedCity.value = currentCityId.value
   selectedRestaurant.value = currentRestaurantId.value
})

const openModal = () => {
   showModal.value = true
   fetchCities()
   fetchRestaurants()
}

const filteredRestaurants = computed(() => {
   if (!selectedCity.value) return restaurants.value
   return restaurants.value.filter(r => r.cityId === selectedCity.value)
})

const closeModal = () => {
   showModal.value = false
   selectedCity.value = null
   selectedRestaurant.value = null
}

const saveSelection = () => {
   setCity(selectedCity.value)
   setRestaurant(selectedRestaurant.value)
   closeModal()
}
</script>

<template>
   <div class="px-4 flex items-center gap-2 cursor-pointer hover:opacity-80"
         @click="openModal">
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24">
         <path stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2"
               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
         <path stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2"
               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span class="text-xs text-gray-500 dark:text-gray-400">
         {{ selectedCityName }}
      </span>
      <span class="text-gray-300 dark:text-gray-600">/</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">
         {{ selectedRestaurantName }}
      </span>
   </div>

   <BaseModal :show="showModal" @close="closeModal">
         <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
               Выбор города и ресторана
            </h3>
         </div>

         <div class="space-y-4 mt-6">
            <div>
               <BaseLabel for="modal-city">Город</BaseLabel>
               <select id="modal-city"
                       v-model="selectedCity"
                       class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option :value="null">Все города</option>
                  <option v-for="city in cities"
                          :key="city.id"
                          :value="city.id">
                     {{ city.name }}
                  </option>
               </select>
            </div>

            <div>
               <BaseLabel for="modal-restaurant">Ресторан</BaseLabel>
               <select id="modal-restaurant"
                       v-model="selectedRestaurant"
                       class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option :value="null">Все рестораны</option>
                  <option v-for="restaurant in filteredRestaurants"
                          :key="restaurant.id"
                          :value="restaurant.id">
                     {{ restaurant.name }}
                  </option>
               </select>
            </div>
         </div>

         <div class="flex gap-3 mt-6">
            <BaseButton variant="secondary" class="flex-1" @click="closeModal">
               Отмена
            </BaseButton>
            <BaseButton variant="primary" class="flex-1" @click="saveSelection">
               Сохранить
            </BaseButton>
         </div>
      </BaseModal>
</template>