<script setup>
useHead({
  title: 'Редактирование сотрудника'
})

const route = useRoute()
const employeeId = route.params.id

const { getEmployee, updateEmployee, loading } = useEmployees()
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
const employee = ref(null)

const getFullPhone = () => {
  const digits = form.value.phone.replace(/\D/g, '')
  return '+' + form.value.countryCode.replace('+', '') + digits
}

const parsePhone = (phone) => {
  if (!phone) return { phone: '', countryCode: '+7' }
  const clean = phone.replace(/\D/g, '')
  if (clean.startsWith('7')) {
    return { phone: clean.slice(1), countryCode: '+7' }
  }
  if (clean.startsWith('375')) {
    return { phone: clean.slice(3), countryCode: '+375' }
  }
  if (clean.startsWith('998')) {
    return { phone: clean.slice(3), countryCode: '+998' }
  }
  if (clean.startsWith('992')) {
    return { phone: clean.slice(3), countryCode: '+992' }
  }
  if (clean.startsWith('996')) {
    return { phone: clean.slice(3), countryCode: '+996' }
  }
  return { phone: clean.slice(1), countryCode: '+7' }
}

onMounted(async () => {
  await fetchRestaurants()
  employee.value = await getEmployee(employeeId)
  if (employee.value && employee.value.phone) {
    const parsed = parsePhone(employee.value.phone)
    form.value.phone = parsed.phone
    form.value.countryCode = parsed.countryCode
  }
  if (employee.value) {
    form.value.email = employee.value.email || ''
    form.value.firstName = employee.value.firstName || ''
    form.value.lastName = employee.value.lastName || ''
    form.value.middleName = employee.value.middleName || ''
    form.value.jobTitle = employee.value.jobTitle || ''
    form.value.isActive = employee.value.isActive ?? true
    form.value.employeeRoles = employee.value.employeeRoles ? [...employee.value.employeeRoles] : []
  }
})

const handleUpdateRoles = (roles) => {
  form.value.employeeRoles = roles
}

const handleUpdateCountryCode = (code) => {
  form.value.countryCode = code
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

const saveEmployee = async () => {
  const validation = validateForm()
  if (!validation.valid) {
    validationError.value = validation.message
    return
  }
  validationError.value = null
  
  const employeeData = {
    phone: getFullPhone() || null,
    email: form.value.email || null,
    firstName: form.value.firstName || null,
    lastName: form.value.lastName || null,
    middleName: form.value.middleName || null,
    jobTitle: form.value.jobTitle || null,
    isActive: form.value.isActive,
    employeeRoles: form.value.employeeRoles
  }
  
  if (form.value.password) {
    employeeData.password = form.value.password
  }
  
  const result = await updateEmployee(employeeId, employeeData)
  if (result.success) {
    showSuccess('Сотрудник успешно обновлён')
    validationError.value = null
    form.value.password = ''
    form.value.passwordConfirmation = ''
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveEmployee" class="space-y-6">
        <FormsEmployeeForm 
          v-model="form" 
          :employee="employee"
          :restaurants="restaurants" 
          :validation-error="validationError"
          :password-error="passwordError"
          @updateEmployeeRoles="handleUpdateRoles"
          @passwordError="handlePasswordError"
          @update:countryCode="handleUpdateCountryCode"
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/employees/${employeeId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
