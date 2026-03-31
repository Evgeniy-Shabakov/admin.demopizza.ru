<script setup>
defineProps({
  restaurant: Object,
  disabled: Boolean,
  showDetails: Boolean,
  cities: Array,
  schedules: Array,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    cityId: null,
    restaurantScheduleId: null,
    deliveryToAddressAvailable: false,
    pickUpAtCounterAvailable: false,
    pickUpAtCarWindowAvailable: false,
    atRestaurantAtCounterAvailable: false,
    atRestaurantToTableAvailable: false,
    deliveryToRestaurantParkingAvailable: false,
    isActive: true,
    street: '',
    house: '',
    addressAsString: ''
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && restaurant">
      <BaseLabel for="restaurant-id">ID</BaseLabel>
      <BaseInput
        id="restaurant-id"
        :model-value="restaurant?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="restaurant-name" required>Название</BaseLabel>
      <BaseInput
        v-if="disabled && restaurant"
        id="restaurant-name"
        :model-value="restaurant.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="restaurant-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        placeholder="Введите название ресторана"
      />
    </div>

    <div>
      <BaseLabel for="restaurant-city" required>Город</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && restaurant"
          id="restaurant-city"
          :value="restaurant.cityId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
        <select
          v-else
          id="restaurant-city"
          v-model="form.cityId"
          :disabled="disabled"
          required
          :class="[
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !form.cityId && validationError 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <option :value="null" disabled>Выберите город</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <BaseLabel for="restaurant-schedule" required>График работы</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && restaurant"
          id="restaurant-schedule"
          :value="restaurant.restaurantScheduleId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="schedule in schedules" :key="schedule.id" :value="schedule.id">
            {{ schedule.name }}
          </option>
        </select>
        <select
          v-else
          id="restaurant-schedule"
          v-model="form.restaurantScheduleId"
          :disabled="disabled"
          required
          :class="[
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !form.restaurantScheduleId && validationError 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <option :value="null" disabled>Выберите график работы</option>
          <option v-for="schedule in schedules" :key="schedule.id" :value="schedule.id">
            {{ schedule.name }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <BaseLabel for="restaurant-street">Улица</BaseLabel>
      <BaseInput
        v-if="disabled && restaurant"
        id="restaurant-street"
        :model-value="restaurant.street"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="restaurant-street"
        v-model="form.street"
        type="text"
        :disabled="disabled"
        placeholder="Введите название улицы"
      />
    </div>

    <div>
      <BaseLabel for="restaurant-house">Дом</BaseLabel>
      <BaseInput
        v-if="disabled && restaurant"
        id="restaurant-house"
        :model-value="restaurant.house"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="restaurant-house"
        v-model="form.house"
        type="text"
        :disabled="disabled"
        placeholder="Введите номер дома"
      />
    </div>

    <div>
      <BaseLabel for="restaurant-address">Адрес</BaseLabel>
      <BaseInput
        v-if="disabled && restaurant"
        id="restaurant-address"
        :model-value="restaurant.addressAsString"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="restaurant-address"
        v-model="form.addressAsString"
        type="text"
        :disabled="disabled"
        placeholder="Полный адрес"
      />
    </div>

    <div class="space-y-3">
      <BaseLabel class="mb-3">Типы обслуживания</BaseLabel>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <BaseCheckbox
            :model-value="disabled && restaurant ? restaurant.deliveryToAddressAvailable : form.deliveryToAddressAvailable"
            :disabled="disabled"
            @update:model-value="form.deliveryToAddressAvailable = $event"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Доставка до адреса</span>
        </div>

        <div class="flex items-center gap-3">
          <BaseCheckbox
            :model-value="disabled && restaurant ? restaurant.pickUpAtCounterAvailable : form.pickUpAtCounterAvailable"
            :disabled="disabled"
            @update:model-value="form.pickUpAtCounterAvailable = $event"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Самовызов у бара</span>
        </div>

        <div class="flex items-center gap-3">
          <BaseCheckbox
            :model-value="disabled && restaurant ? restaurant.pickUpAtCarWindowAvailable : form.pickUpAtCarWindowAvailable"
            :disabled="disabled"
            @update:model-value="form.pickUpAtCarWindowAvailable = $event"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Самовывоз в окне выдачи для автомобиля</span>
        </div>

        <div class="flex items-center gap-3">
          <BaseCheckbox
            :model-value="disabled && restaurant ? restaurant.atRestaurantAtCounterAvailable : form.atRestaurantAtCounterAvailable"
            :disabled="disabled"
            @update:model-value="form.atRestaurantAtCounterAvailable = $event"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">В ресторане (забирает у бара)</span>
        </div>

        <div class="flex items-center gap-3">
          <BaseCheckbox
            :model-value="disabled && restaurant ? restaurant.atRestaurantToTableAvailable : form.atRestaurantToTableAvailable"
            :disabled="disabled"
            @update:model-value="form.atRestaurantToTableAvailable = $event"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">В ресторане (доставка к столику)</span>
        </div>

        <div class="flex items-center gap-3">
          <BaseCheckbox
            :model-value="disabled && restaurant ? restaurant.deliveryToRestaurantParkingAvailable : form.deliveryToRestaurantParkingAvailable"
            :disabled="disabled"
            @update:model-value="form.deliveryToRestaurantParkingAvailable = $event"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Доставка на парковку у ресторана</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <BaseCheckbox
        :model-value="disabled && restaurant ? restaurant.isActive : form.isActive"
        :disabled="disabled"
        @update:model-value="form.isActive = $event"
      />
      <span class="text-sm text-gray-700 dark:text-gray-300">Активен</span>
    </div>

    <div v-if="showDetails && restaurant">
      <BaseLabel for="restaurant-created">Создано</BaseLabel>
      <BaseInput
        id="restaurant-created"
        :model-value="restaurant.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && restaurant">
      <BaseLabel for="restaurant-updated">Обновлено</BaseLabel>
      <BaseInput
        id="restaurant-updated"
        :model-value="restaurant.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500">
      {{ validationError }}
    </p>
  </div>
</template>
