<script setup>
definePageMeta({
  layout: false
})

const { initTheme } = useTheme()
const { login, checkAuth } = useAuth()

const phone = ref('')
const countryCode = ref('+7')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const formError = ref('')
const errors = ref({
  phone: '',
  password: ''
})

const getFullPhone = () => {
  const digits = phone.value.replace(/\D/g, '')
  return '+' + countryCode.value.replace('+', '') + digits
}

const validate = () => {
  formError.value = ''
  errors.value.phone = ''
  errors.value.password = ''
  
  const digits = phone.value.replace(/\D/g, '')
  if (digits.length < 9) {
    errors.value.phone = 'Введите номер телефона'
  }
  
  if (password.value.length < 8) {
    errors.value.password = 'Пароль должен быть не менее 8 символов'
  }
  
  return !errors.value.phone && !errors.value.password
}

const onSubmit = async () => {
  if (!validate()) return
  
  loading.value = true
  formError.value = ''
  const result = await login(getFullPhone(), password.value)
  loading.value = false
  
  if (result.success) {
    await checkAuth()
    navigateTo('/')
  } else if (result.error) {
    formError.value = result.error.message
  }
}

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Вход в систему
        </h1>
        
        <form @submit.prevent="onSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Номер телефона
            </label>
            <UiPhoneInput v-model="phone" @update:countryCode="countryCode = $event" />
            <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Пароль
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Введите пароль"
                class="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l22 22" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
          
          <p v-if="formError" class="text-red-500 text-sm mt-4 text-center">{{ formError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>