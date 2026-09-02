<script setup>
useHead({
  title: 'Добавить график работы'
})

const { createRestaurantSchedule, loading } = useRestaurantSchedules()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  mondayOpenTime: '09:00',
  mondayCloseTime: '21:00',
  mondayIsOpen: true,
  tuesdayOpenTime: '09:00',
  tuesdayCloseTime: '21:00',
  tuesdayIsOpen: true,
  wednesdayOpenTime: '09:00',
  wednesdayCloseTime: '21:00',
  wednesdayIsOpen: true,
  thursdayOpenTime: '09:00',
  thursdayCloseTime: '21:00',
  thursdayIsOpen: true,
  fridayOpenTime: '09:00',
  fridayCloseTime: '21:00',
  fridayIsOpen: true,
  saturdayOpenTime: '09:00',
  saturdayCloseTime: '21:00',
  saturdayIsOpen: true,
  sundayOpenTime: '09:00',
  sundayCloseTime: '21:00',
  sundayIsOpen: true
})

const formRef = ref(null)
const validationError = ref(null)

const resetForm = () => {
  form.value = {
    name: '',
    mondayOpenTime: '09:00',
    mondayCloseTime: '21:00',
    mondayIsOpen: true,
    tuesdayOpenTime: '09:00',
    tuesdayCloseTime: '21:00',
    tuesdayIsOpen: true,
    wednesdayOpenTime: '09:00',
    wednesdayCloseTime: '21:00',
    wednesdayIsOpen: true,
    thursdayOpenTime: '09:00',
    thursdayCloseTime: '21:00',
    thursdayIsOpen: true,
    fridayOpenTime: '09:00',
    fridayCloseTime: '21:00',
    fridayIsOpen: true,
    saturdayOpenTime: '09:00',
    saturdayCloseTime: '21:00',
    saturdayIsOpen: true,
    sundayOpenTime: '09:00',
    sundayCloseTime: '21:00',
    sundayIsOpen: true
  }
}

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveSchedule(false)
  }
}

const saveSchedule = async (navigateToList = false) => {
  validationError.value = null
  const result = await createRestaurantSchedule({
    name: form.value.name,
    mondayOpenTime: form.value.mondayOpenTime || null,
    mondayCloseTime: form.value.mondayCloseTime || null,
    mondayIsOpen: form.value.mondayIsOpen,
    tuesdayOpenTime: form.value.tuesdayOpenTime || null,
    tuesdayCloseTime: form.value.tuesdayCloseTime || null,
    tuesdayIsOpen: form.value.tuesdayIsOpen,
    wednesdayOpenTime: form.value.wednesdayOpenTime || null,
    wednesdayCloseTime: form.value.wednesdayCloseTime || null,
    wednesdayIsOpen: form.value.wednesdayIsOpen,
    thursdayOpenTime: form.value.thursdayOpenTime || null,
    thursdayCloseTime: form.value.thursdayCloseTime || null,
    thursdayIsOpen: form.value.thursdayIsOpen,
    fridayOpenTime: form.value.fridayOpenTime || null,
    fridayCloseTime: form.value.fridayCloseTime || null,
    fridayIsOpen: form.value.fridayIsOpen,
    saturdayOpenTime: form.value.saturdayOpenTime || null,
    saturdayCloseTime: form.value.saturdayCloseTime || null,
    saturdayIsOpen: form.value.saturdayIsOpen,
    sundayOpenTime: form.value.sundayOpenTime || null,
    sundayCloseTime: form.value.sundayCloseTime || null,
    sundayIsOpen: form.value.sundayIsOpen
  })
  if (result.success) {
    showSuccess('График работы успешно добавлен')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/restaurant-schedules')
    } else {
      resetForm()
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveSchedule(true)" class="space-y-6">
        <FormsRestaurantScheduleForm 
          v-model="form" 
          :validation-error="validationError" 
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Добавить
          </BaseButton>
          <BaseButton type="button" :loading="loading" @click="handleSaveAndAdd">
            Добавить и добавить еще
          </BaseButton>
          <NuxtLink to="/restaurant-schedules" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
