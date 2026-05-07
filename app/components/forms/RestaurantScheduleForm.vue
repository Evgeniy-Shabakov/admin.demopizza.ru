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
      <div v-if="showDetails && schedule"
           class="flex gap-4">
         <div class="w-20">
            <BaseLabel for="schedule-id">ID</BaseLabel>
            <BaseInput id="schedule-id"
                       :model-value="schedule?.id"
                       type="text"
                       disabled />
         </div>
         <div class="flex-1">
            <BaseLabel for="schedule-name">Название</BaseLabel>
            <BaseInput id="schedule-name"
                       :model-value="schedule.name"
                       type="text"
                       disabled />
         </div>
      </div>

      <div v-else>
         <BaseLabel for="schedule-name"
                    required>Название</BaseLabel>
         <BaseInput id="schedule-name"
                    v-model="form.name"
                    type="text"
                    :disabled="disabled"
                    required
                    placeholder="Введите название графика" />
      </div>

       <div>
          <div class="space-y-2">
             <div v-for="day in days"
                  :key="day.key"
                  class="py-2">
                <div class="flex items-center gap-3">
                   <span :class="[
                      'text-sm font-medium w-6',
                      (disabled && schedule ? schedule[`${day.key}IsOpen`] : form[`${day.key}IsOpen`]) ? '' : 'text-gray-400'
                   ]">{{ day.label }}</span>
                   <BaseCheckbox :model-value="disabled && schedule ? schedule[`${day.key}IsOpen`] : form[`${day.key}IsOpen`]"
                                 :disabled="disabled"
                                 @update:model-value="form[`${day.key}IsOpen`] = $event" />
                   <span :class="(disabled && schedule ? schedule[`${day.key}IsOpen`] : form[`${day.key}IsOpen`]) ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
                         class="text-sm">
                      {{ (disabled && schedule ? schedule[`${day.key}IsOpen`] : form[`${day.key}IsOpen`]) ? 'Рабочий' :
                      'Нерабочий' }}
                   </span>
                </div>
                <div class="mt-2 flex items-center gap-2">
                    <BaseInput :model-value="disabled && schedule ? formatTime(schedule[`${day.key}OpenTime`]) : form[`${day.key}OpenTime`]"
                               type="time"
                               :disabled="disabled"
                               size="sm"
                               class="w-24"
                               @update:model-value="form[`${day.key}OpenTime`] = $event" />
                    <span class="text-gray-400 text-xs">—</span>
                    <BaseInput :model-value="disabled && schedule ? formatTime(schedule[`${day.key}CloseTime`]) : form[`${day.key}CloseTime`]"
                               type="time"
                               :disabled="disabled"
                               size="sm"
                               class="w-24"
                               @update:model-value="form[`${day.key}CloseTime`] = $event" />
                </div>
             </div>
          </div>
       </div>

      <div v-if="showDetails && schedule"
           class="flex gap-4 pt-2">
         <div>
            <BaseLabel for="schedule-created">Создано</BaseLabel>
            <BaseInput id="schedule-created"
                       :model-value="schedule.createdAt"
                       type="text"
                       disabled />
         </div>
         <div>
            <BaseLabel for="schedule-updated">Обновлено</BaseLabel>
            <BaseInput id="schedule-updated"
                       :model-value="schedule.updatedAt"
                       type="text"
                       disabled />
         </div>
      </div>

      <p v-if="validationError"
         class="text-sm text-red-500">
         {{ validationError }}
      </p>
   </div>
</template>
