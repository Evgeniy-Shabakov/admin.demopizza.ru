<script setup>
useHead({
  title: 'Добавить дизайн'
})

const { createDesign, loading } = useDesigns()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  isActive: false,
  primaryColor: '#000000',
  secondaryColor: '#ffffff'
})

const formRef = ref(null)
const validationError = ref(null)

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveDesign(false)
  }
}

const saveDesign = async (navigateToList = false) => {
  validationError.value = null
  const result = await createDesign({
    name: form.value.name,
    isActive: form.value.isActive,
    settings: {
      primaryColor: form.value.primaryColor,
      secondaryColor: form.value.secondaryColor
    }
  })
  if (result.success) {
    showSuccess('Дизайн успешно добавлен')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/designs')
    } else {
      form.value.name = ''
      form.value.isActive = false
      form.value.primaryColor = '#000000'
      form.value.secondaryColor = '#ffffff'
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveDesign(true)" class="space-y-6">
        <FormsDesignForm 
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
          <NuxtLink to="/designs" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>