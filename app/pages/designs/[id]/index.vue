<script setup>
useHead({
  title: 'Просмотр дизайна'
})

const route = useRoute()
const designId = route.params.id
const { getDesign, loading } = useDesigns()

const design = ref(null)

onMounted(async () => {
  design.value = await getDesign(Number(designId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="design">
      <FormsDesignForm 
        :design="design" 
        disabled
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Дизайн не найден</p>
    </BaseCard>
  </div>
</template>