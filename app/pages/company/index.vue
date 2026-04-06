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
      <FormsCompanyForm 
        :company="company" 
        :disabled="true"
      />
    </BaseCard>
  </div>
</template>
