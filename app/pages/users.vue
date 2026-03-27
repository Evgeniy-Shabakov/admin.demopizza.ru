<script setup>
useHead({
  title: 'Пользователи'
})

const showDeleteModal = ref(false)
const userToDelete = ref(null)

const users = ref([
  { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'Админ', status: 'Активен' },
  { id: 2, name: 'Мария Петрова', email: 'maria@example.com', role: 'Пользователь', status: 'Активен' },
  { id: 3, name: 'Алексей Сидоров', email: 'alex@example.com', role: 'Редактор', status: 'Неактивен' },
  { id: 4, name: 'Анна Козлова', email: 'anna@example.com', role: 'Пользователь', status: 'Активен' },
  { id: 5, name: 'Дмитрий Смирнов', email: 'dmitry@example.com', role: 'Пользователь', status: 'Ожидает' },
])

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = () => {
  if (userToDelete.value) {
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    showDeleteModal.value = false
    userToDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Имя</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Роль</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                  {{ user.name.charAt(0) }}
                </div>
                <span class="font-medium">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                user.role === 'Админ' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' :
                user.role === 'Редактор' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              ]">{{ user.role }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                user.status === 'Активен' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                user.status === 'Неактивен' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
                'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
              ]">{{ user.status }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-3">Редактировать</button>
              <button @click="confirmDelete(user)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50 transition-opacity" @click="showDeleteModal = false"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-center mb-2">Удалить пользователя</h3>
            <p class="text-gray-500 dark:text-gray-400 text-center mb-6">
              Вы уверены, что хотите удалить <strong>{{ userToDelete?.name }}</strong>? Это действие нельзя отменить.
            </p>
            <div class="flex gap-3">
              <button @click="showDeleteModal = false" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Отмена
              </button>
              <button @click="deleteUser" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
