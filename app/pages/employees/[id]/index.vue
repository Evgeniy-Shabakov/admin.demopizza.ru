<script setup>
useHead({
  title: 'Просмотр сотрудника'
})

const route = useRoute()
const employeeId = route.params.id
const { getEmployee, loading } = useEmployees()
const { fetchRestaurants, restaurants } = useRestaurants()

const employee = ref(null)

onMounted(async () => {
  await Promise.all([
    getEmployee(employeeId),
    fetchRestaurants()
  ])
  employee.value = await getEmployee(employeeId)
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <FormsEmployeeForm 
        v-if="employee"
        :employee="employee"
        :restaurants="restaurants"
        :disabled="true"
        :show-details="true"
      />

      <div class="flex flex-wrap gap-4 pt-4">
        <NuxtLink :to="`/employees/${employeeId}/edit`" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer">
          Редактировать
        </NuxtLink>
        <NuxtLink to="/employees" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
          Назад
        </NuxtLink>
      </div>
    </BaseCard>
  </div>
</template>
