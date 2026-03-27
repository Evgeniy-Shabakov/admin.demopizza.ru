<script setup>
useHead({
  title: 'Настройки'
})

const settings = ref({
  siteName: 'Панель управления',
  siteEmail: 'admin@example.com',
  notifications: true,
  darkMode: false,
  language: 'ru'
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div>
        <h3 class="text-lg font-semibold mb-4">Основные</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Название сайта</label>
            <input
              v-model="settings.siteName"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email сайта</label>
            <input
              v-model="settings.siteEmail"
              type="email"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <div>
        <h3 class="text-lg font-semibold mb-4">Предпочтения</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Email уведомления</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Получать email обновления</p>
            </div>
            <button
              @click="settings.notifications = !settings.notifications"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.notifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Язык</label>
            <select
              v-model="settings.language"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
        Сохранить
      </button>
      <button class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
        Отмена
      </button>
    </div>
  </div>
</template>
