<script setup>
defineProps({
  modelValue: Boolean,
  disabled: Boolean,
  label: String
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="flex items-center cursor-pointer">
    <div class="relative">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        class="sr-only peer"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <div class="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
    </div>
    <span v-if="label" class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ label }}</span>
  </label>
</template>
