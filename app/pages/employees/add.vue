<script setup>
useHead({
  title: 'Добавить сотрудника'
})

const { createEmployee, loading } = useEmployees()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess } = useToast()

const form = ref({
  phone: '',
  countryCode: '+7',
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  jobTitle: '',
  isActive: true,
  employeeRoles: [],
  password: '',
  passwordConfirmation: ''
})

const formRef = ref(null)
const validationError = ref(null)
const passwordError = ref(null)

const getFullPhone = () => {
  const digits = form.value.phone.replace(/\D/g, '')
  return '+' + form.value.countryCode.replace('+', '') + digits
}

onMounted(async () => {
  await fetchRestaurants()
})

const handleUpdateCountryCode = (code) => {
  form.value.countryCode = code
}

const handleUpdateRoles = (roles) => {
  form.value.employeeRoles = roles
}

const handlePasswordError = (error) => {
  passwordError.value = error
}

const validateForm = () => {
  if (!form.value.phone) {
    return { valid: false, message: 'Введите телефон' }
  }
  if (!form.value.employeeRoles || form.value.employeeRoles.length === 0) {
    return { valid: false, message: 'Добавьте хотя бы одну роль' }
  }
  passwordError.value = null
  if (form.value.password || form.value.passwordConfirmation) {
    if (!form.value.password) {
      passwordError.value = 'Введите пароль'
      return { valid: false, message: '' }
    }
    if (form.value.password.length < 8) {
      passwordError.value = 'Пароль должен быть не менее 8 символов'
      return { valid: false, message: '' }
    }
    if (form.value.password !== form.value.passwordConfirmation) {
      passwordError.value = 'Пароли не совпадают'
      return { valid: false, message: '' }
    }
  }
  return { valid: true }
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

const saveEmployee = async (navigateToList = true) => {
  const validation = validateForm()
  if (!validation.valid) {
    validationError.value = validation.message
    return
  }
  validationError.value = null
  passwordError.value = null
  
  const employeeData = {
    phone: getFullPhone() || null,
    email: form.value.email || null,
    firstName: form.value.firstName || null,
    lastName: form.value.lastName || null,
    middleName: form.value.middleName || null,
    jobTitle: form.value.jobTitle || null,
    isActive: form.value.isActive ?? true,
    employeeRoles: form.value.employeeRoles,
    password: form.value.password || null
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
        countryCode: '+7',
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        jobTitle: '',
        isActive: true,
        employeeRoles: [],
        password: '',
        passwordConfirmation: ''
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
          :password-error="passwordError"
          @updateEmployeeRoles="handleUpdateRoles"
          @passwordError="handlePasswordError"
          @update:countryCode="handleUpdateCountryCode"
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
