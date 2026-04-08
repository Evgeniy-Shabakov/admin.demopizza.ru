<script setup>
import { IconEye, IconEyeOff } from '~/components/icons'

const modelValue = defineModel()

const props = defineProps({
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  error: String,
  id: String,
  name: String,
  required: Boolean,
  autocomplete: String,
  size: {
    type: String,
    default: 'md'
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const showPassword = ref(false)
</script>

<template>
  <div class="w-full">
    <div class="relative">
      <input
        :id="id"
        :name="name"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="[
          'w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-3' : 'px-4 py-2',
          error
            ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 placeholder-red-400/70'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
          disabled || readonly ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : '',
          'pr-10'
        ]"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur')"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button type="button"
                @click="showPassword = !showPassword"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer focus:outline-none">
          <IconEye v-if="showPassword" class="w-5 h-5" />
          <IconEyeOff v-else class="w-5 h-5" />
        </button>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>