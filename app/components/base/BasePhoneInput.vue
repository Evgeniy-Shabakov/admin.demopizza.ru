<script setup>
const props = defineProps({
  modelValue: String,
  countryCode: String,
  placeholder: {
    type: String,
    default: '(999) 123-45-67'
  },
  error: String,
  label: String,
  id: String,
  required: Boolean,
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'update:countryCode'])

const inputRef = ref(null)

const countryCodes = [
  { code: '+7', name: 'RU', mask: '(999) 999-99-99' },
  { code: '+375', name: 'BY', mask: '(99) 999-99-99' },
  { code: '+998', name: 'UZ', mask: '(99) 999-99-99' },
  { code: '+992', name: 'TJ', mask: '999-999-999' },
  { code: '+996', name: 'KG', mask: '(999) 999-999' },
  { code: '+7', name: 'KZ', mask: '(999) 999-99-99', alt: true },
]

const selectedCountry = computed(() => {
  if (props.countryCode) {
    const found = countryCodes.find(c => c.code === props.countryCode)
    return found || countryCodes[0]
  }
  return countryCodes[0]
})

const showMask = computed(() => props.disabled || !props.modelValue)

const displayValue = computed(() => {
  if (props.disabled || !props.modelValue) {
    return formatPhone(props.modelValue || '', selectedCountry.value.mask)
  }
  return props.modelValue
})

const formatPhone = (value, mask) => {
  const digits = value.replace(/\D/g, '')
  let formatted = ''
  let digitIndex = 0

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === '9') {
      formatted += digits[digitIndex]
      digitIndex++
    } else {
      formatted += mask[i]
    }
  }

  return formatted
}

const onInput = (e) => {
  const digits = e.target.value.replace(/\D/g, '')
  const formatted = formatPhone(digits, selectedCountry.value.mask)
  emit('update:modelValue', formatted)
}

const onCountryChange = (e) => {
  const index = e.target.selectedIndex
  selectedCountry.value = countryCodes[index]
  emit('update:countryCode', selectedCountry.value.code)
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="w-full">
    <BaseLabel v-if="label" :for="id" :required="required">{{ label }}</BaseLabel>
    <div class="flex w-full">
      <select :value="selectedCountry.code"
              @change="onCountryChange"
              :disabled="disabled"
              class="py-2 pl-2 pr-6 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer w-24 sm:w-28 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
        <option v-for="country in countryCodes"
                :key="country.code"
                :value="country.code">
          {{ country.name }} {{ country.code }}
        </option>
      </select>

      <input id="phone"
             ref="inputRef"
             type="tel"
             :value="displayValue"
             @input="onInput"
             :placeholder="placeholder"
             :disabled="disabled"
             class="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed" />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>
