<script setup>
useHead({
  title: 'Добавить категорию'
})

const { createCategory, loading } = useCategories()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  position: null
})

const formRef = ref(null)
const validationError = ref(null)

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveCategory(false)
  }
}

const saveCategory = async (navigateToList = false) => {
  validationError.value = null
  const result = await createCategory({
    name: form.value.name,
    position: form.value.position ? Number(form.value.position) : null
  })
  if (result.success) {
    showSuccess('Категория успешно добавлена')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/categories')
    } else {
      form.value.name = ''
      form.value.position = null
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveCategory(true)" class="space-y-6">
        <FormsCategoryForm 
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
          <NuxtLink to="/categories" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
