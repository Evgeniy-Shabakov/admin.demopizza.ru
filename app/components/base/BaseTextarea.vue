<script setup>
defineProps({
  modelValue: [String, Number],
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  error: String,
  id: String,
  name: String,
  required: Boolean,
  rows: {
    type: Number,
    default: 3
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="w-full">
    <textarea
      :id="id"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :class="[
        'w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none',
        error
          ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 placeholder-red-400/70'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
        disabled || readonly ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>
