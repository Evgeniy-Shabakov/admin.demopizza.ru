<script setup>
defineProps({
  schedule: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    mondayOpenTime: '',
    mondayCloseTime: '',
    mondayIsOpen: true,
    tuesdayOpenTime: '',
    tuesdayCloseTime: '',
    tuesdayIsOpen: true,
    wednesdayOpenTime: '',
    wednesdayCloseTime: '',
    wednesdayIsOpen: true,
    thursdayOpenTime: '',
    thursdayCloseTime: '',
    thursdayIsOpen: true,
    fridayOpenTime: '',
    fridayCloseTime: '',
    fridayIsOpen: true,
    saturdayOpenTime: '',
    saturdayCloseTime: '',
    saturdayIsOpen: true,
    sundayOpenTime: '',
    sundayCloseTime: '',
    sundayIsOpen: true
  })
})

const days = [
  { key: 'monday', label: 'Пн' },
  { key: 'tuesday', label: 'Вт' },
  { key: 'wednesday', label: 'Ср' },
  { key: 'thursday', label: 'Чт' },
  { key: 'friday', label: 'Пт' },
  { key: 'saturday', label: 'Сб' },
  { key: 'sunday', label: 'Вс' }
]

const formatTime = (time) => {
  if (!time) return ''
  if (typeof time === 'string') return time
  const hours = String(time.hours || 0).padStart(2, '0')
  const minutes = String(time.minutes || 0).padStart(2, '0')
  return `${hours}:${minutes}`
}

const toggleDay = (dayKey) => {
  if (!form.value.disabled) {
    form.value[`${dayKey}IsOpen`] = !form.value[`${dayKey}IsOpen`]
  }
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="showDetails && schedule" class="flex gap-4">
      <div class="w-20">
        <BaseLabel for="schedule-id">ID</BaseLabel>
        <BaseInput id="schedule-id" :model-value="schedule?.id" type="text" disabled />
      </div>
      <div class="flex-1">
        <BaseLabel for="schedule-name">Название</BaseLabel>
        <BaseInput id="schedule-name" :model-value="schedule.name" type="text" disabled />
      </div>
    </div>

    <div v-else>
      <BaseLabel for="schedule-name" required>Название</BaseLabel>
      <BaseInput
        id="schedule-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        placeholder="Введите название графика"
      />
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 class="text-sm font-medium mb-3">График работы</h3>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 dark:text-gray-400">
              <th class="pb-2 pr-2">День</th>
              <th class="pb-2 pr-2">Открыто</th>
              <th class="pb-2 pr-2">Время</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in days" :key="day.key" class="border-t border-gray-100 dark:border-gray-700">
              <td class="py-2 pr-2 align-middle">
                <span :class="[
                  form[`${day.key}IsOpen`] ? 'font-medium' : 'text-gray-400'
                ]">{{ day.label }}</span>
              </td>
              <td class="py-2 pr-2 align-middle">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="disabled && schedule ? schedule[`${day.key}IsOpen`] : form[`${day.key}IsOpen`]"
                    :disabled="disabled"
                    @change="toggleDay(day.key)"
                    class="w-4 h-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                  />
                </label>
              </td>
              <td class="py-2">
                <div v-if="disabled && schedule" class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                  <span v-if="schedule[`${day.key}IsOpen`]">
                    {{ formatTime(schedule[`${day.key}OpenTime`]) }} — {{ formatTime(schedule[`${day.key}CloseTime`]) }}
                  </span>
                  <span v-else class="text-gray-400">Выходной</span>
                </div>
                <div v-else class="flex items-center gap-2">
                  <BaseInput
                    v-model="form[`${day.key}OpenTime`]"
                    type="time"
                    :disabled="disabled || !form[`${day.key}IsOpen`]"
                    class="w-28"
                  />
                  <span class="text-gray-400">—</span>
                  <BaseInput
                    v-model="form[`${day.key}CloseTime`]"
                    type="time"
                    :disabled="disabled || !form[`${day.key}IsOpen`]"
                    class="w-28"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDetails && schedule" class="flex gap-4 pt-2">
      <div>
        <BaseLabel for="schedule-created">Создано</BaseLabel>
        <BaseInput id="schedule-created" :model-value="schedule.createdAt" type="text" disabled />
      </div>
      <div>
        <BaseLabel for="schedule-updated">Обновлено</BaseLabel>
        <BaseInput id="schedule-updated" :model-value="schedule.updatedAt" type="text" disabled />
      </div>
    </div>

    <p v-if="validationError" class="text-sm text-red-500">
      {{ validationError }}
    </p>
  </div>
</template>
