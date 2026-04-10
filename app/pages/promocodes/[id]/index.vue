<script setup>
useHead({
  title: 'Просмотр промокода'
})

const route = useRoute()
const promocodeId = route.params.id
const { getPromocode, loading } = usePromocodes()

const promocode = ref(null)

onMounted(async () => {
  promocode.value = await getPromocode(Number(promocodeId))
})

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('ru-RU')
}

const getEmployeeName = (employee) => {
  if (!employee) return '—'
  const name = [employee.firstName, employee.lastName].filter(Boolean).join(' ')
  return name || '—'
}

const getEmployeePhone = (employee) => {
  if (!employee || !employee.phone) return '—'
  return employee.phone
}
</script>

<template>
  <div class="space-y-4 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <template v-else-if="promocode">
      <BaseCard class="p-4 md:py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Информация о промокоде</h2>
          <span :class="[
            'px-2 py-0.5 rounded-full text-xs font-medium self-start',
            promocode.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          ]">
            {{ promocode.isActive ? 'Активен' : 'Неактивен' }}
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">ID</span>
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ promocode.id }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Бонусы</span>
            <span class="font-medium text-amber-600 dark:text-amber-400">{{ promocode.bonusCoins }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Промокод</span>
            <span class="font-medium text-indigo-600 dark:text-indigo-400">{{ promocode.code }}</span>
          </div>

          <div v-if="promocode.description" class="pt-2">
            <span class="text-gray-500 dark:text-gray-400 text-xs block">Описание</span>
            <p class="text-gray-900 dark:text-gray-100 text-xs mt-1">{{ promocode.description }}</p>
          </div>

          <div class="flex justify-between pt-2">
            <span class="text-gray-500 dark:text-gray-400">Создан</span>
            <span class="text-gray-900 dark:text-gray-100 text-xs">{{ formatDate(promocode.createdAt) }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Обновлен</span>
            <span class="text-gray-900 dark:text-gray-100 text-xs">{{ formatDate(promocode.updatedAt) }}</span>
          </div>
        </div>
      </BaseCard>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseCard v-if="promocode.employee" class="p-4 md:p-3">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Создал</h3>
          <p class="font-medium text-gray-900 dark:text-gray-100">{{ getEmployeeName(promocode.employee) }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ getEmployeePhone(promocode.employee) }}</p>
        </BaseCard>

        <BaseCard class="p-4 md:p-3">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Применил</h3>
          <p v-if="promocode.user" class="font-medium text-green-600 dark:text-green-400">{{ promocode.user.phone }}</p>
          <p v-else class="text-gray-400">—</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(promocode.usedAt) }}</p>
        </BaseCard>
      </div>
    </template>

    <BaseCard v-else class="py-8">
      <p class="text-gray-500 dark:text-gray-400 text-center">Промокод не найден</p>
    </BaseCard>
  </div>
</template>