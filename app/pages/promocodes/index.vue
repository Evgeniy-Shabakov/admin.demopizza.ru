<script setup>
useHead({
  title: 'Промокоды'
})

const { promocodes, loading, pagination, perPageOptions, fetchPromocodes } = usePromocodes()

const activeFilter = ref('all')

onMounted(() => {
  fetchPromocodes(1)
})

const loadPage = (page) => {
  fetchPromocodes(page, null, activeFilter.value)
}

const changePerPage = (perPage) => {
  fetchPromocodes(1, perPage, activeFilter.value)
}

const setFilter = (filter) => {
  activeFilter.value = filter
  fetchPromocodes(1, null, filter)
}

const columns = [
  { key: 'id', label: 'ID', mobileLabel: 'ID', showInMobile: false },
  { key: 'code', label: 'Промокод', title: 'Скопировать', mobileLabel: 'Промокод', render: (item) => `<span class="inline-flex px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded font-medium">${item.code}</span>` },
  { key: 'bonusCoins', label: 'Бонусные монеты', mobileLabel: 'Бонусы', render: (item) => `<span class="inline-flex px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-medium">${item.bonusCoins}</span>` },
  { key: 'description', label: 'Описание', mobileLabel: 'Описание', render: (item) => item.description || '—' },
  {
    key: 'isActive',
    label: 'Активен',
    align: 'center',
    mobileLabel: 'Статус',
    render: (item) => item.isActive
       ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span>'
       : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span>'
  },
  { key: 'employee', label: 'Сотрудник', mobileLabel: 'Сотрудник', render: (item) => {
    if (!item.employee) return '—'
    const name = [item.employee.firstName, item.employee.lastName].filter(Boolean).join(' ')
    if (!name && !item.employee.phone) return '—'
    return name 
      ? `${name}<br><span class="text-gray-500 text-xs">${item.employee.phone || ''}</span>`
      : `<span class="text-gray-500 text-xs">${item.employee.phone}</span>`
  } },
  { key: 'userPhone', label: 'Применил', mobileLabel: 'Применил', render: (item) => item.user?.phone 
    ? `<span class="inline-flex px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-medium">${item.user.phone}</span>` 
    : '—' },
  { key: 'usedAt', label: 'Когда применил', mobileLabel: 'Когда', render: (item) => item.usedAt 
    ? `<span class="inline-flex px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-medium">${new Date(item.usedAt).toLocaleString('ru-RU')}</span>` 
    : '—' },
  { key: 'createdAt', label: 'Создано', mobileLabel: 'Создано' },
  { key: 'updatedAt', label: 'Обновлено', mobileLabel: 'Обновлено' },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <div class="flex gap-2 mb-4">
    <button 
      v-for="filter in [
        { value: 'all', label: 'Все' },
        { value: 'active', label: 'Активные' },
        { value: 'used', label: 'Примененные' }
      ]" 
      :key="filter.value"
      @click="setFilter(filter.value)"
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-colors',
        activeFilter === filter.value 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      ]"
    >
      {{ filter.label }}
    </button>
  </div>

  <UiListTable :items="promocodes"
               :columns="columns"
               :loading="loading"
               empty-text="Промокоды не найдены"
               view-link-prefix="/promocodes"
               edit-link-prefix="/promocodes"
               copy-column-key="code"
               :show-delete="false" />

  <UiPagination 
    :pagination="pagination"
    :per-page-options="perPageOptions"
    @page-change="loadPage"
    @per-page-change="changePerPage"
  />
</template>
