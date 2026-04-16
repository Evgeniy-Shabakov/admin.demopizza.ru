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
  backgroundPageMainColor: '#f3f4f6',
  backgroundPageElementsColor: '#ffffff',
  brandColor: '#ff6b35',
  textColorMain: '#000000',
  textColorOnBrandColor: '#ffffff',
  textColorAccent: '#008000',
  bottomNavColor: '#a6a6a6'
})

const design = ref(null)
const validationError = ref(null)

onMounted(async () => {
  design.value = await getDesign(Number(designId))
  if (design.value) {
    form.value.name = design.value.name
    form.value.isActive = design.value.isActive
    form.value.backgroundPageMainColor = design.value.settings?.backgroundPageMainColor || '#f3f4f6'
    form.value.backgroundPageElementsColor = design.value.settings?.backgroundPageElementsColor || '#ffffff'
    form.value.brandColor = design.value.settings?.brandColor || '#ff6b35'
    form.value.textColorMain = design.value.settings?.textColorMain || '#000000'
    form.value.textColorOnBrandColor = design.value.settings?.textColorOnBrandColor || '#ffffff'
    form.value.textColorAccent = design.value.settings?.textColorAccent || '#008000'
    form.value.bottomNavColor = design.value.settings?.bottomNavColor || '#a6a6a6'
  }
})

const saveDesign = async () => {
  validationError.value = null
  const result = await updateDesign(Number(designId), {
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