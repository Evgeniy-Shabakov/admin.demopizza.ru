<script setup>
defineProps({
  for: String,
  required: Boolean
})
</script>

<template>
  <label
    :for="for"
    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
  >
    <slot />
    <span v-if="required" class="text-red-500 ml-0.5">*</span>
  </label>
</template>
