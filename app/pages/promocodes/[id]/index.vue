<script setup>
useHead({
  title: 'Просмотр промокода'
})

const route = useRoute()
const promocodeId = route.params.id
const { getPromocode, loading } = usePromocodes()

const promocode = ref(null)

onMounted(async () => {
  promocode.value = await getPromocode(Number(promocodeId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="promocode">
      <FormsPromocodeForm 
        :promocode="promocode" 
        disabled 
        :show-details="true" 
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Промокод не найден</p>
    </BaseCard>
  </div>
</template>