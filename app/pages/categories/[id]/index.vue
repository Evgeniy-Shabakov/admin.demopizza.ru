<script setup>
useHead({
  title: 'Просмотр категории'
})

const route = useRoute()
const categoryId = route.params.id
const { getCategory, loading } = useCategories()

const category = ref(null)

onMounted(async () => {
  category.value = await getCategory(Number(categoryId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="category">
      <FormsCategoryForm 
        :category="category" 
        disabled 
        :show-details="true" 
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Категория не найдена</p>
    </BaseCard>
  </div>
</template>
