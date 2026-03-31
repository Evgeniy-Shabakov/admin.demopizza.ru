<script setup>
useHead({
  title: 'Редактирование категории'
})

const route = useRoute()
const categoryId = route.params.id
const { getCategory, updateCategory, loading } = useCategories()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  position: null
})

const category = ref(null)
const validationError = ref(null)

onMounted(async () => {
  category.value = await getCategory(Number(categoryId))
  if (category.value) {
    form.value.name = category.value.name
    form.value.position = category.value.position
  }
})

const saveCategory = async () => {
  validationError.value = null
  const result = await updateCategory(Number(categoryId), {
    name: form.value.name,
    position: form.value.position ? Number(form.value.position) : null
  })
  if (result.success) {
    showSuccess('Категория успешно отредактирована')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveCategory" class="space-y-6">
        <FormsCategoryForm 
          v-model="form" 
          :validation-error="validationError"
        />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/categories/${categoryId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
