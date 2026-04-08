<script setup>
import { getRoleName } from '~/constants/roles'

useHead({
   title: 'Сотрудники'
})

const router = useRouter()
const { employees, loading, fetchEmployees, deleteEmployee } = useEmployees()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess } = useToast()

onMounted(() => {
   fetchEmployees()
   fetchRestaurants()
})

const handleRowClick = (id) => {
   router.push(`/employees/${id}`)
}

const handleDelete = async (item) => {
   const result = await deleteEmployee(item.id)
   if (result) {
      showSuccess('Сотрудник успешно удалён')
   }
}

const getRestaurantName = (restaurantId) => {
   if (!restaurantId) return 'Все рестораны'
   const restaurant = restaurants.value.find(r => r.id === restaurantId)
   return restaurant?.name || '—'
}

const getEmployeeRoles = (employeeRoles) => {
   if (!employeeRoles || employeeRoles.length === 0) return '—'
   return employeeRoles.map(er => {
      const roleName = getRoleName(er.roleId)
      const restaurantName = er.restaurantId ? getRestaurantName(er.restaurantId) : 'Все рестораны'
      return `${roleName} (${restaurantName})`
   }).join('<br>')
}

const columns = [
   { key: 'id', label: 'ID' },
   { key: 'lastName', label: 'Фамилия', bold: true },
   { key: 'firstName', label: 'Имя', bold: true },
   { key: 'phone', label: 'Телефон', mobileLabel: 'Тел.' },
   { key: 'email', label: 'Email', showInMobile: false },
   { key: 'jobTitle', label: 'Должность', showInMobile: false },
   { key: 'isActive', label: 'Активен', align: 'center', mobileLabel: 'Статус', render: (item) => item.isActive
      ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span>'
      : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span>'
   },
   { key: 'roles', label: 'Роли', render: (item) => getEmployeeRoles(item.employeeRoles), showInMobile: false },
   { key: 'createdAt', label: 'Создано', showInMobile: false },
   { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
   { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
   <UiListTable :items="employees"
                :columns="columns"
                :loading="loading"
                empty-text="Сотрудники не найдены"
                view-link-prefix="/employees"
                edit-link-prefix="/employees"
                delete-label="сотрудника"
                @row-click="handleRowClick"
                @delete="handleDelete" />
</template>
