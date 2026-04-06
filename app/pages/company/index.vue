<script setup>
useHead({
  title: 'Данные компании'
})

const { getCompanyData, loading } = useCompany()

const company = ref(null)

onMounted(async () => {
  company.value = await getCompanyData()
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <div class="flex justify-end mb-4">
        <NuxtLink to="/company/edit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Редактировать
        </NuxtLink>
      </div>
      <FormsCompanyForm 
        :company="company" 
        :disabled="true"
      />
    </BaseCard>
  </div>
</template>
