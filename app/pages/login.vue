<script setup>
definePageMeta({ layout: false })

import { IconEye, IconEyeOff } from '~/components/icons'

const { initTheme } = useTheme()
const { login } = useAuth()

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
     await navigateTo('/')
   } else if (result.error) {
     formError.value = result.error.message
   }
}

onMounted(async () => {
   initTheme()
   
   if (import.meta.client) {
      const token = useCookie('employeeAccessToken')
      const refreshToken = useCookie('employeeRefreshToken')
      if (token.value || refreshToken.value) {
         try {
            const api = useApi()
            const response = await api.get('/auth/jwt-payload/employee')
            const { setAuthenticated, setEmployee } = useAuthState()
            const jwtPayload = response.data.data.jwtPayload
            const employee = {
               id: jwtPayload.id,
               phone: jwtPayload.phone,
               employeeRoles: jwtPayload.employeeRoles
            }
            setEmployee(employee)
            setAuthenticated(true)
            await navigateTo('/')
            return
         } catch (e) {
            console.error('Token validation failed:', e)
         }
      }
   }
})
</script>

<template>
   <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="w-full max-w-md">
         <BaseCard class="p-8">
            <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
               Вход в систему
            </h1>

            <form @submit.prevent="onSubmit">
               <div class="mb-4">
                  <BaseLabel for="phone">Номер телефона</BaseLabel>
                  <div class="w-full">
                     <UiPhoneInput v-model="phone"
                                   @update:countryCode="countryCode = $event" />
                  </div>
                  <p v-if="errors.phone"
                     class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
               </div>

               <div class="mb-6">
                  <BaseLabel for="password">Пароль</BaseLabel>
                  <BaseInput
                     id="password"
                     v-model="password"
                     :type="showPassword ? 'text' : 'password'"
                     placeholder="Введите пароль"
                     :error="errors.password"
                  >
                     <template #append>
                         <button type="button"
                                @click="showPassword = !showPassword"
                                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
                           <IconEye v-if="showPassword" class="w-5 h-5" />
                           <IconEyeOff v-else class="w-5 h-5" />
                        </button>
                     </template>
                  </BaseInput>
               </div>

               <BaseButton type="submit"
                           :loading="loading"
                           class="w-full">
                  {{ loading ? 'Вход...' : 'Войти' }}
               </BaseButton>

               <p v-if="formError"
                  class="text-red-500 text-sm mt-4 text-center">{{ formError }}</p>
            </form>
         </BaseCard>
      </div>
   </div>
</template>
