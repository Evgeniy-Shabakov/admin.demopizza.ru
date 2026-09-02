<script setup>
useHead({
  title: 'Просмотр записи стоп-листа'
})

const route = useRoute()
const stopListItemId = route.params.id
const { getStopListItem, loading } = useStopList()

const stopListItem = ref(null)

onMounted(async () => {
  stopListItem.value = await getStopListItem(Number(stopListItemId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="stopListItem">
      <FormsStopListForm 
        :stop-list-item="stopListItem" 
        disabled 
        :show-details="true" 
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Запись не найдена</p>
    </BaseCard>
  </div>
</template>
