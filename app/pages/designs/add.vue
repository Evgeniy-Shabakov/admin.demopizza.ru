<script setup>
useHead({
  title: 'Добавить дизайн'
})

const { createDesign, loading } = useDesigns()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  isActive: false,
  backgroundPageMainColor: '#f3f4f6',
  backgroundPageElementsColor: '#ffffff',
  brandColor: '#ff6b35',
  textColorMain: '#000000',
  textColorOnBrandColor: '#ffffff',
  textColorAccent: '#008000',
  bottomNavColor: '#a6a6a6'
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
      backgroundPageMainColor: form.value.backgroundPageMainColor,
      backgroundPageElementsColor: form.value.backgroundPageElementsColor,
      brandColor: form.value.brandColor,
      textColorMain: form.value.textColorMain,
      textColorOnBrandColor: form.value.textColorOnBrandColor,
      textColorAccent: form.value.textColorAccent,
      bottomNavColor: form.value.bottomNavColor
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
      form.value.backgroundPageMainColor = '#f3f4f6'
      form.value.backgroundPageElementsColor = '#ffffff'
      form.value.brandColor = '#ff6b35'
      form.value.textColorMain = '#000000'
      form.value.textColorOnBrandColor = '#ffffff'
      form.value.textColorAccent = '#008000'
      form.value.bottomNavColor = '#a6a6a6'
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