<script setup>
useHead({
  title: 'Редактирование сотрудника'
})

const route = useRoute()
const employeeId = route.params.id
const router = useRouter()

const { getEmployee, updateEmployee, loading } = useEmployees()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess } = useToast()

const form = ref({
  phone: '',
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  jobTitle: '',
  isActive: true,
  employeeRoles: []
})

const formRef = ref(null)
const validationError = ref(null)
const employee = ref(null)

onMounted(async () => {
  await fetchRestaurants()
  employee.value = await getEmployee(employeeId)
  if (employee.value) {
    form.value = {
      phone: employee.value.phone || '',
      email: employee.value.email || '',
      firstName: employee.value.firstName || '',
      lastName: employee.value.lastName || '',
      middleName: employee.value.middleName || '',
      jobTitle: employee.value.jobTitle || '',
      isActive: employee.value.isActive ?? true,
      employeeRoles: employee.value.employeeRoles ? [...employee.value.employeeRoles] : []
    }
  }
})

const handleUpdateRoles = (roles) => {
  form.value.employeeRoles = roles
}

const validateForm = () => {
  if (!form.value.phone) {
    return { valid: false, message: 'Введите телефон' }
  }
  if (!form.value.employeeRoles || form.value.employeeRoles.length === 0) {
    return { valid: false, message: 'Добавьте хотя бы одну роль' }
  }
  return { valid: true }
}

const saveEmployee = async () => {
  const validation = validateForm()
  if (!validation.valid) {
    validationError.value = validation.message
    return
  }
  validationError.value = null
  
  const employeeData = {
    phone: form.value.phone || null,
    email: form.value.email || null,
    firstName: form.value.firstName || null,
    lastName: form.value.lastName || null,
    middleName: form.value.middleName || null,
    jobTitle: form.value.jobTitle || null,
    isActive: form.value.isActive,
    employeeRoles: form.value.employeeRoles
  }
  
  const result = await updateEmployee(employeeId, employeeData)
  if (result.success) {
    showSuccess('Сотрудник успешно обновлён')
    validationError.value = null
    router.push(`/employees/${employeeId}`)
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveEmployee" class="space-y-6">
        <FormsEmployeeForm 
          v-model="form" 
          :employee="employee"
          :restaurants="restaurants" 
          :validation-error="validationError"
          @updateEmployeeRoles="handleUpdateRoles"
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/employees/${employeeId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
