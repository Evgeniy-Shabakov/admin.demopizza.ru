<script setup>
useHead({
  title: 'Добавить сотрудника'
})

const { createEmployee, loading } = useEmployees()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess } = useToast()

const form = ref({
  phone: '',
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  jobTitle: '',
  employeeRoles: []
})

const formRef = ref(null)
const validationError = ref(null)

onMounted(async () => {
  await fetchRestaurants()
})

const handleUpdateRoles = (roles) => {
  form.value.employeeRoles = roles
}

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    const validation = validateForm()
    if (!validation.valid) {
      validationError.value = validation.message
      return
    }
    await saveEmployee(false)
  }
}

const validateForm = () => {
  if (!form.value.phone) {
    return { valid: false, message: 'Введите телефон' }
  }
  if (!form.value.employeeRoles || form.value.employeeRoles.length === 0) {
    return { valid: false, message: 'Добавьте хотя бы одну роль' }
  }
  return { valid: true }
}

const saveEmployee = async (navigateToList = true) => {
  const validation = validateForm()
  if (!validation.valid) {
    validationError.value = validation.message
    return
  }
  validationError.value = null
  
  const employeeData = {
    phone: form.value.phone || null,
    email: form.value.email || null,
    firstName: form.value.firstName || null,
    lastName: form.value.lastName || null,
    middleName: form.value.middleName || null,
    jobTitle: form.value.jobTitle || null,
    employeeRoles: form.value.employeeRoles
  }
  
  
  const result = await createEmployee(employeeData)
  if (result.success) {
    showSuccess('Сотрудник успешно создан')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/employees')
    } else {
      form.value = {
        phone: '',
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        jobTitle: '',
        employeeRoles: []
      }
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveEmployee(true)" class="space-y-6">
        <FormsEmployeeForm 
          v-model="form" 
          :restaurants="restaurants" 
          :validation-error="validationError"
          @updateEmployeeRoles="handleUpdateRoles"
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Добавить
          </BaseButton>
          <BaseButton type="button" :loading="loading" @click="handleSaveAndAdd">
            Добавить и добавить еще
          </BaseButton>
          <NuxtLink to="/employees" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
