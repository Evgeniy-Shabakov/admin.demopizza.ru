<script setup>
useHead({
  title: 'Редактировать данные компании'
})

const router = useRouter()
const { getCompanyData, updateCompanyData, loading } = useCompany()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  brandName: '',
  tagline: '',
  logoFile: null,
  faviconFile: null,
  phoneForOrders: '',
  aboutUs: '',
  contacts: '',
  linksSocial: '',
  isBonusCoinsEnabled: true
})

const company = ref(null)
const formRef = ref(null)
const validationError = ref(null)

onMounted(async () => {
  company.value = await getCompanyData()
  if (company.value) {
    form.value = {
      name: company.value.name || '',
      brandName: company.value.brandName || '',
      tagline: company.value.tagline || '',
      logoFile: null,
      faviconFile: null,
      phoneForOrders: company.value.phoneForOrders || '',
      aboutUs: company.value.aboutUs || '',
      contacts: company.value.contacts || '',
      linksSocial: company.value.linksSocial || '',
      isBonusCoinsEnabled: company.value.isBonusCoinsEnabled
    }
  }
})

const saveCompany = async () => {
  validationError.value = null
  const result = await updateCompanyData({
    name: form.value.name,
    brandName: form.value.brandName,
    tagline: form.value.tagline,
    logoFile: form.value.logoFile,
    faviconFile: form.value.faviconFile,
    phoneForOrders: form.value.phoneForOrders,
    aboutUs: form.value.aboutUs,
    contacts: form.value.contacts,
    linksSocial: form.value.linksSocial,
    isBonusCoinsEnabled: form.value.isBonusCoinsEnabled
  })
  if (result.success) {
    showSuccess('Данные компании успешно обновлены')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveCompany" class="space-y-6">
        <FormsCompanyForm 
          v-model="form" 
          :company="company"
          :validation-error="validationError" 
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink to="/company" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
