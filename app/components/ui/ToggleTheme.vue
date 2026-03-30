<script setup>
import { IconMoon, IconSun } from '~/components/icons'

const { theme, toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
   <div class="flex items-center gap-3">
       <button @click="toggleTheme"
               class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
         <IconMoon v-if="theme === 'light'" class="w-5 h-5" />
         <IconSun v-else class="w-5 h-5" />
      </button>
   </div>
</template>