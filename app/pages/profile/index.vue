<script setup>
import { getRoleName } from '~/constants/roles'

useHead({
  title: 'Личный кабинет'
})

const { employee: authEmployee, fetchCurrentUser } = useAuthState()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess, error: showError } = useToast()

const employee = ref(null)
const loading = ref(true)

const password = ref('')
const passwordConfirmation = ref('')
const oldPassword = ref('')
const passwordError = ref('')

const updateOldPassword = (value) => {
  oldPassword.value = value
}

const updatePassword = (value) => {
  password.value = value
  validatePassword()
}

const updatePasswordConfirmation = (value) => {
  passwordConfirmation.value = value
  validatePasswordConfirmation()
}

const validatePassword = () => {
  passwordError.value = ''
  if (password.value && password.value.length < 8) {
    passwordError.value = 'Пароль должен быть не менее 8 символов'
  } else if (password.value && passwordConfirmation.value && password.value !== passwordConfirmation.value) {
    passwordError.value = 'Пароли не совпадают'
  }
}

const validatePasswordConfirmation = () => {
  passwordError.value = ''
  if (password.value && passwordConfirmation.value && password.value !== passwordConfirmation.value) {
    passwordError.value = 'Пароли не совпадают'
  }
}

const getErrorDetails = (e) => {
  const status = e.response?.status
  const data = e.response?.data
  if (!data && !status) return null
  return data ? JSON.stringify(data, null, 2) : null
}

const getStatusCode = (e) => e.response?.status || null

const savePassword = async () => {
  if (!oldPassword.value) {
    passwordError.value = 'Введите старый пароль'
    return
  }
  if (!password.value || !passwordConfirmation.value) {
    passwordError.value = 'Введите пароль и подтверждение'
    return
  }
  if (password.value.length < 8) {
    passwordError.value = 'Пароль должен быть не менее 8 символов'
    return
  }
  if (password.value !== passwordConfirmation.value) {
    passwordError.value = 'Пароли не совпадают'
    return
  }

  const api = useApi()
  try {
    loading.value = true
    await api.patch(`/employees/${authEmployee.value.id}/change-password`, {
      password: oldPassword.value,
      newPassword: password.value
    })
    showSuccess('Пароль успешно изменён')
    oldPassword.value = ''
    password.value = ''
    passwordConfirmation.value = ''
  } catch (e) {
    showError({ message: 'Ошибка при смене пароля', details: getErrorDetails(e), statusCode: getStatusCode(e) })
  } finally {
    loading.value = false
  }
}

const formatPhone = (phone) => {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  
  if (digits.length === 10) {
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`
  }
  
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    const code = digits.startsWith('7') ? '+7' : '+8'
    const num = digits.slice(1)
    return `${code} (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6, 8)}-${num.slice(8)}`
  }
  
  return phone
}

const getRestaurantName = (restaurantId) => {
  if (!restaurantId) return 'Все рестораны'
  const restaurant = restaurants.value.find(r => r.id === restaurantId)
  return restaurant?.name || '—'
}

const getEmployeeRoles = (employeeRoles) => {
  if (!employeeRoles || employeeRoles.length === 0) return '—'
  return employeeRoles.map(er => {
    const roleName = getRoleName(er.roleId)
    const restaurantName = er.restaurantId ? getRestaurantName(er.restaurantId) : 'Все рестораны'
    return `${roleName} (${restaurantName})`
  }).join(', ')
}

const employeeInitials = computed(() => {
  if (!employee.value?.firstName) return employee.value?.phone ? employee.value.phone.charAt(0) : '?'
  return (employee.value.firstName.charAt(0) + (employee.value.lastName ? employee.value.lastName.charAt(0) : '')).toUpperCase()
})

const employeeDisplayName = computed(() => {
  if (!employee.value) return 'Сотрудник'
  const firstName = employee.value.firstName || ''
  const lastName = employee.value.lastName || ''
  const name = `${lastName} ${firstName}`.trim()
  return name || formatPhone(employee.value.phone) || 'Сотрудник'
})

onMounted(async () => {
  loading.value = true
  await Promise.all([
    fetchCurrentUser(),
    fetchRestaurants()
  ])
  employee.value = authEmployee.value
  loading.value = false
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <div v-if="loading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>

      <div v-else-if="employee" class="space-y-6">
        <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg md:text-xl">
            {{ employeeInitials }}
          </div>
          <div>
            <h2 class="text-lg md:text-xl font-semibold">{{ employeeDisplayName }}</h2>
            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">{{ getEmployeeRoles(employee.employeeRoles || employee.roles) }}</p>
          </div>
        </div>

        <div class="grid gap-4">
          <div v-if="employee.phone" class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Телефон</span>
            <span class="text-sm font-medium">{{ formatPhone(employee.phone) }}</span>
          </div>

          <div v-if="employee.email" class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Email</span>
            <span class="text-sm font-medium">{{ employee.email }}</span>
          </div>

          <div v-if="employee.jobTitle" class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Должность</span>
            <span class="text-sm font-medium">{{ employee.jobTitle }}</span>
          </div>

          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Статус</span>
            <span class="text-sm font-medium">
              <span v-if="employee.isActive" class="text-green-600 dark:text-green-400">Активен</span>
              <span v-else class="text-gray-500">Неактивен</span>
            </span>
          </div>

          <div v-if="employee.createdAt" class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Дата создания</span>
            <span class="text-sm font-medium">{{ new Date(employee.createdAt).toLocaleDateString('ru-RU') }}</span>
          </div>
        </div>

        <UiSettingPassword
          class="mt-6"
          :old-password="oldPassword"
          :password="password"
          :password-confirmation="passwordConfirmation"
          :error="passwordError"
          @update:old-password="updateOldPassword"
          @update:password="updatePassword"
          @update:password-confirmation="updatePasswordConfirmation"
          @blur="validatePasswordConfirmation"
        />

        <div class="flex gap-4 pt-4">
          <button @click="savePassword"
                  :disabled="loading"
                  class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors cursor-pointer">
            Сохранить пароль
          </button>
          <NuxtLink to="/employees" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Назад
          </NuxtLink>
        </div>
      </div>
    </BaseCard>
  </div>
</template>