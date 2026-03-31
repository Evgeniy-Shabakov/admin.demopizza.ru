<script setup>
useHead({
  title: 'Графики работы'
})

import { IconWarning } from '~/components/icons'

const router = useRouter()
const { restaurantSchedules, loading, fetchRestaurantSchedules, deleteRestaurantSchedule } = useRestaurantSchedules()
const { success: showSuccess } = useToast()
const showDeleteModal = ref(false)
const scheduleToDelete = ref(null)

onMounted(() => {
  fetchRestaurantSchedules()
})

const viewSchedule = (id) => {
  router.push(`/restaurant-schedules/${id}`)
}

const confirmDelete = (schedule) => {
  scheduleToDelete.value = schedule
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (scheduleToDelete.value) {
    const result = await deleteRestaurantSchedule(scheduleToDelete.value.id)
    if (result) {
      showSuccess('График работы успешно удалён')
    }
    showDeleteModal.value = false
    scheduleToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  scheduleToDelete.value = null
}

let clickTimeout = null
let clickCount = 0

const handleRowClick = (id) => {
  clickCount++
  if (clickCount === 1) {
    clickTimeout = setTimeout(() => {
      clickCount = 0
    }, 300)
  } else if (clickCount === 2) {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      clickTimeout = null
    }
    clickCount = 0
    viewSchedule(id)
  }
}

const formatTime = (time) => {
  if (!time) return '—'
  if (typeof time === 'string') return time
  const hours = String(time.hours || 0).padStart(2, '0')
  const minutes = String(time.minutes || 0).padStart(2, '0')
  return `${hours}:${minutes}`
}

const isScheduleActive = (schedule) => {
  return schedule.mondayIsOpen || schedule.tuesdayIsOpen || schedule.wednesdayIsOpen || 
         schedule.thursdayIsOpen || schedule.fridayIsOpen || schedule.saturdayIsOpen || schedule.sundayIsOpen
}

const days = [
  { key: 'monday', label: 'Пн' },
  { key: 'tuesday', label: 'Вт' },
  { key: 'wednesday', label: 'Ср' },
  { key: 'thursday', label: 'Чт' },
  { key: 'friday', label: 'Пт' },
  { key: 'saturday', label: 'Сб' },
  { key: 'sunday', label: 'Вс' }
]

const getDaySchedule = (schedule, dayKey) => {
  const isOpen = schedule[`${dayKey}IsOpen`]
  if (!isOpen) return 'Выходной'
  const openTime = formatTime(schedule[`${dayKey}OpenTime`])
  const closeTime = formatTime(schedule[`${dayKey}CloseTime`])
  return `${openTime} - ${closeTime}`
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else padding="none">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название</th>
              <th v-for="day in days" :key="day.key" class="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ day.label }}</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Создано</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Обновлено</th>
              <th class="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky right-0">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="schedule in restaurantSchedules" 
              :key="schedule.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              @click="handleRowClick(schedule.id)"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm select-text">{{ schedule.id }}</td>
              <td class="px-4 py-4 whitespace-nowrap font-medium select-text">{{ schedule.name }}</td>
              <td v-for="day in days" :key="day.key" class="px-1 py-4 whitespace-nowrap text-center text-xs select-text">
                <span :class="schedule[`${day.key}IsOpen`] ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'">
                  {{ getDaySchedule(schedule, day.key) }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 select-text">{{ schedule.createdAt }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 select-text">{{ schedule.updatedAt }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm select-text sticky right-0 bg-white dark:bg-gray-800">
                <UiActionListButtons
                  :view-link="`/restaurant-schedules/${schedule.id}`"
                  :edit-link="`/restaurant-schedules/${schedule.id}/edit`"
                  @delete="confirmDelete(schedule)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="schedule in restaurantSchedules" 
          :key="schedule.id" 
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div class="p-4" @click="viewSchedule(schedule.id)">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ schedule.id }}</p>
            </div>
            <p class="font-medium">{{ schedule.name }}</p>
            <div class="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs">
              <span v-for="day in days" :key="day.key" :class="schedule[`${day.key}IsOpen`] ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'">
                {{ day.label }}: {{ getDaySchedule(schedule, day.key) }}
              </span>
            </div>
          </div>
          <div class="px-4 pb-4">
            <UiActionListButtons
              :view-link="`/restaurant-schedules/${schedule.id}`"
              :edit-link="`/restaurant-schedules/${schedule.id}/edit`"
              small
              @delete="confirmDelete(schedule)"
            />
          </div>
        </div>
        
        <div v-if="restaurantSchedules.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          Графики работы не найдены
        </div>
      </div>
    </BaseCard>

    <BaseModal :show="showDeleteModal" @close="cancelDelete">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
          <IconWarning class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Удалить график работы
        </h3>

        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
          Вы уверены, что хотите удалить <strong>{{ scheduleToDelete?.name }}</strong>? Это действие нельзя отменить.
        </p>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="secondary" class="flex-1" @click="cancelDelete">
          Отмена
        </BaseButton>
        <BaseButton variant="danger" class="flex-1" :loading="loading" @click="handleDelete">
          Удалить
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
