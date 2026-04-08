<script setup>
import { IconEye, IconEyeOff } from '~/components/icons'

defineProps({
  password: {
    type: String,
    default: ''
  },
  passwordConfirmation: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:password', 'update:passwordConfirmation', 'blur'])

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const validatePassword = () => {
  emit('blur', 'password')
}

const validatePasswordConfirmation = () => {
  emit('blur', 'passwordConfirmation')
}
</script>

<template>
  <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
    <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">Установка пароля</h3>
    <div class="max-w-sm space-y-4">
      <div>
        <BaseLabel for="employee-password">Пароль</BaseLabel>
        <div class="relative">
          <input
            id="employee-password"
            :type="showPassword ? 'text' : 'password'"
            :value="password"
            placeholder="Введите пароль"
            class="w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-4 py-2 pr-10"
            :class="error && !passwordConfirmation ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 placeholder-red-400/70' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'"
            @input="emit('update:password', $event.target.value)"
            @blur="validatePassword"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button type="button" @click="showPassword = !showPassword" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer focus:outline-none">
              <IconEye v-if="showPassword" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <BaseLabel for="employee-password-confirmation">Подтверждение пароля</BaseLabel>
        <div class="relative">
          <input
            id="employee-password-confirmation"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            :value="passwordConfirmation"
            placeholder="Подтвердите пароль"
            class="w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-4 py-2 pr-10"
            :class="error === 'Пароли не совпадают' ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 placeholder-red-400/70' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'"
            @input="emit('update:passwordConfirmation', $event.target.value)"
            @blur="validatePasswordConfirmation"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button type="button" @click="showPasswordConfirmation = !showPasswordConfirmation" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer focus:outline-none">
              <IconEye v-if="showPasswordConfirmation" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>
