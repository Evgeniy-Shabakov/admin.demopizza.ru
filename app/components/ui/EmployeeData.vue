<script setup>
import { getRoleName } from '~/constants/roles'

const { employee } = useAuthState()
const { logout } = useAuth()

const formatPhone = (phone) => {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  
  if (digits.length === 10) {
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`
  }
  
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    const code = digits.startsWith('7') ? '+7' : '+8'
    const num = digits.slice(1)
    return `${code} (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6, 8)}-${num.slice(8)}`
  }
  
  if (digits.length >= 12) {
    const codeMatch = digits.match(/^(\d{1,3})/)
    const code = codeMatch ? '+' + codeMatch[1] : ''
    const num = digits.slice(code.length - 1)
    if (num.length === 10) {
      return `${code} (${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6, 8)}-${num.slice(8)}`
    }
    return `${code} ${num}`
  }
  
  return phone
}

const employeeInitials = computed(() => {
  if (!employee.value?.firstName) return employee.value?.phone ? employee.value.phone.charAt(0) : '?'
  return employee.value.firstName.charAt(0).toUpperCase()
})

const employeeDisplayName = computed(() => {
  if (!employee.value) return 'Сотрудник'
  const firstName = employee.value.firstName || ''
  const lastName = employee.value.lastName || ''
  const name = `${firstName} ${lastName}`.trim()
  return name || formatPhone(employee.value.phone) || 'Сотрудник'
})

const employeeRole = computed(() => {
  if (!employee.value) return 'Администратор'
  const roles = employee.value.employeeRoles || employee.value.roles || []
  if (roles.length > 0 && roles[0].roleId) {
    return getRoleName(roles[0].roleId)
  }
  if (employee.value.firstName) return 'Администратор'
  return formatPhone(employee.value.phone)
})
</script>

<template>
   <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-3">
         <div class="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
            {{ employeeInitials }}
         </div>
          <div class="flex flex-col">
             <span class="text-sm font-medium leading-tight">{{ employeeDisplayName }}</span>
             <span class="text-xs text-gray-500 dark:text-gray-400">{{ employeeRole }}</span>
          </div>
      </div>
   </div>
</template>