<script setup>
useHead({
  title: 'Редактирование дизайна'
})

const route = useRoute()
const designId = route.params.id
const { getDesign, updateDesign, loading } = useDesigns()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  isActive: false,
  primaryColor: '#000000',
  secondaryColor: '#ffffff'
})

const design = ref(null)
const validationError = ref(null)

onMounted(async () => {
  design.value = await getDesign(Number(designId))
  if (design.value) {
    form.value.name = design.value.name
    form.value.isActive = design.value.isActive
    form.value.primaryColor = design.value.settings?.primaryColor || '#000000'
    form.value.secondaryColor = design.value.settings?.secondaryColor || '#ffffff'
  }
})

const saveDesign = async () => {
  validationError.value = null
  const result = await updateDesign(Number(designId), {
    name: form.value.name,
    isActive: form.value.isActive,
    settings: {
      primaryColor: form.value.primaryColor,
      secondaryColor: form.value.secondaryColor
    }
  })
  if (result.success) {
    showSuccess('Дизайн успешно отредактирован')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveDesign" class="space-y-6">
        <FormsDesignForm 
          v-model="form" 
          :validation-error="validationError"
        />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/designs/${designId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>