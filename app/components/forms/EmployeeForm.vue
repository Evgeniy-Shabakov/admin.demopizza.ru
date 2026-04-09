<script setup>
import { ROLE } from '~/constants/roles'

const props = defineProps({
  employee: Object,
  disabled: Boolean,
  showDetails: Boolean,
  restaurants: Array,
  validationError: String,
  passwordError: String
})

const { employee: currentEmployee } = useAuthState()

const emit = defineEmits(['updateEmployeeRoles', 'passwordError', 'update:countryCode'])

const form = defineModel({
  default: () => ({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    jobTitle: '',
    isActive: true,
    employeeRoles: [],
    password: '',
    passwordConfirmation: ''
  })
})

const countryCode = ref('+7')

const countryCodes = [
  { code: '+7', name: 'RU', mask: '(999) 999-99-99' },
  { code: '+375', name: 'BY', mask: '(99) 999-99-99' },
  { code: '+998', name: 'UZ', mask: '(99) 999-99-99' },
  { code: '+992', name: 'TJ', mask: '999-999-999' },
  { code: '+996', name: 'KG', mask: '(999) 999-999' },
]

const formatPhone = (value, mask) => {
  const digits = value.replace(/\D/g, '')
  let formatted = ''
  let digitIndex = 0

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === '9') {
      formatted += digits[digitIndex]
      digitIndex++
    } else {
      formatted += mask[i]
    }
  }

  return formatted
}

const parsedPhone = computed(() => {
  if (!props.employee?.phone) return null
  const phone = props.employee.phone
  const clean = phone.replace(/\D/g, '')
  
  let countryCode = '+7'
  let digits = clean
  
  if (clean.startsWith('375')) {
    countryCode = '+375'
    digits = clean.slice(3)
  } else if (clean.startsWith('998')) {
    countryCode = '+998'
    digits = clean.slice(3)
  } else if (clean.startsWith('992')) {
    countryCode = '+992'
    digits = clean.slice(3)
  } else if (clean.startsWith('996')) {
    countryCode = '+996'
    digits = clean.slice(3)
  } else if (clean.startsWith('7') && clean.length > 1) {
    countryCode = '+7'
    digits = clean.slice(1)
  }
  
  const country = countryCodes.find(c => c.code === countryCode) || countryCodes[0]
  const formatted = formatPhone(digits, country.mask)
  
  return { countryCode, phone: formatted }
})

const displayPhone = computed({
  get() {
    if (props.employee && !disabled) {
      return parsedPhone.value?.phone || form.value.phone
    }
    return form.value.phone
  },
  set(value) {
    form.value.phone = value.replace(/\D/g, '')
  }
})

const onCountryChange = (code) => {
  countryCode.value = code
  emit('update:countryCode', code)
}

const getFullPhone = () => {
  const digits = form.value.phone.replace(/\D/g, '')
  return countryCode.value.replace('+', '') + digits
}

const isCurrentUserSuperAdmin = computed(() => {
  return currentEmployee.value?.employeeRoles?.some(role => {
    const roleData = Object.values(ROLE).find(r => r.ID === role.roleId)
    return roleData?.NAME === 'super-admin'
  })
})

const roleOptions = computed(() => {
  const excludeRoles = ['super-admin']
  if (!isCurrentUserSuperAdmin.value) {
    excludeRoles.push('Владелец')
  }
  
  return Object.values(ROLE)
    .filter(role => !excludeRoles.includes(role.NAME))
    .map(role => ({
      id: role.ID,
      name: role.NAME,
      description: role.DESCRIPTION
    }))
})

const displayRoles = computed(() => roleOptions.value)

const restaurantsLoaded = computed(() => props.restaurants && props.restaurants.length > 0)

const addRole = () => {
  form.value.employeeRoles.push({
    roleId: null,
    restaurantId: null
  })
}

const removeRole = (index) => {
  form.value.employeeRoles.splice(index, 1)
  emit('updateEmployeeRoles', form.value.employeeRoles)
}

const updateRoleField = (index, field, value) => {
  form.value.employeeRoles[index][field] = value
  emit('updateEmployeeRoles', form.value.employeeRoles)
}

const getRoleName = (roleId) => {
  const role = Object.values(ROLE).find(r => r.ID === roleId)
  return role?.NAME || '—'
}

const getRoleDescription = (roleId) => {
  const role = Object.values(ROLE).find(r => r.ID === roleId)
  return role?.DESCRIPTION || ''
}

const getRestaurantName = (restaurantId) => {
  if (!restaurantId) return 'Все рестораны'
  const restaurant = props.restaurants?.find(r => r.id === restaurantId)
  return restaurant?.name || '—'
}

const getSelectValue = (restaurantId) => {
  return restaurantId ?? ''
}

const validatePassword = () => {
  let error = ''
  if (form.value.password && form.value.password.length < 8) {
    error = 'Пароль должен быть не менее 8 символов'
  }
  emit('passwordError', error)
}

const validatePasswordConfirmation = () => {
  let error = ''
  if (form.value.password && form.value.passwordConfirmation && form.value.password !== form.value.passwordConfirmation) {
    error = 'Пароли не совпадают'
  }
  emit('passwordError', error)
}

const handlePasswordBlur = (field) => {
  if (field === 'password') {
    validatePassword()
  } else if (field === 'passwordConfirmation') {
    validatePasswordConfirmation()
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && employee">
      <BaseLabel for="employee-id">ID</BaseLabel>
      <BaseInput
        id="employee-id"
        :model-value="employee?.id"
        type="text"
        disabled
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <BaseLabel for="employee-lastname">Фамилия</BaseLabel>
        <BaseInput
          v-if="disabled && employee"
          id="employee-lastname"
          :model-value="employee.lastName"
          type="text"
          disabled
        />
        <BaseInput
          v-else
          id="employee-lastname"
          v-model="form.lastName"
          type="text"
          :disabled="disabled"
          placeholder="Фамилия"
        />
      </div>

      <div>
        <BaseLabel for="employee-firstname">Имя</BaseLabel>
        <BaseInput
          v-if="disabled && employee"
          id="employee-firstname"
          :model-value="employee.firstName"
          type="text"
          disabled
        />
        <BaseInput
          v-else
          id="employee-firstname"
          v-model="form.firstName"
          type="text"
          :disabled="disabled"
          placeholder="Имя"
        />
      </div>

      <div>
        <BaseLabel for="employee-middlename">Отчество</BaseLabel>
        <BaseInput
          v-if="disabled && employee"
          id="employee-middlename"
          :model-value="employee.middleName"
          type="text"
          disabled
        />
        <BaseInput
          v-else
          id="employee-middlename"
          v-model="form.middleName"
          type="text"
          :disabled="disabled"
          placeholder="Отчество"
        />
      </div>
    </div>

    <div>
      <BasePhoneInput
        v-if="disabled && employee"
        id="employee-phone"
        :model-value="parsedPhone.phone"
        :country-code="parsedPhone.countryCode"
        label="Телефон"
        disabled
      />
      <BasePhoneInput
        v-else
        id="employee-phone"
        v-model="form.phone"
        :country-code="countryCode"
        label="Телефон"
        :required="true"
        class="w-full"
        @update:countryCode="onCountryChange"
      />
    </div>

    <div>
      <BaseLabel for="employee-email">Email</BaseLabel>
      <BaseInput
        v-if="disabled && employee"
        id="employee-email"
          :model-value="employee.email"
        type="email"
        disabled
      />
      <BaseInput
        v-else
        id="employee-email"
        v-model="form.email"
        type="email"
        :disabled="disabled"
        placeholder="example@mail.ru"
      />
    </div>

    <div v-if="!disabled">
      <UiSettingPassword
        v-model:password="form.password"
        v-model:password-confirmation="form.passwordConfirmation"
        :error="passwordError"
        @blur="handlePasswordBlur"
      />
    </div>

    <div>
      <BaseLabel for="employee-jobtitle">Должность</BaseLabel>
      <BaseInput
        v-if="disabled && employee"
        id="employee-jobtitle"
        :model-value="employee.jobTitle"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="employee-jobtitle"
        v-model="form.jobTitle"
        type="text"
        :disabled="disabled"
        placeholder="Введите должность"
      />
    </div>

    <div v-if="!disabled || (disabled && employee)" class="flex items-center gap-3">
      <BaseCheckbox
        :model-value="disabled && employee ? employee.isActive : form.isActive"
        :disabled="disabled"
        @update:model-value="form.isActive = $event"
      />
      <span class="text-sm text-gray-700 dark:text-gray-300">Активен</span>
    </div>

    <div>
      <BaseLabel>Роли</BaseLabel>
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-3">
        <p>Выберите роль и ресторан для сотрудника.</p>
        <ul class="list-disc list-inside mt-1 space-y-1">
          <li v-for="role in displayRoles" :key="role.id">
            <span class="font-medium">{{ role.name }}</span> — {{ role.description }}
          </li>
        </ul>
      </div>
      
      <div v-if="disabled && employee && employee.employeeRoles?.length" class="space-y-3">
        <div 
          v-for="(role, index) in employee.employeeRoles" 
          :key="index"
          class="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400">Роль:</span>
              <span class="ml-2 font-medium">{{ getRoleName(role.roleId) }}</span>
            </div>
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400">Ресторан:</span>
              <span class="ml-2 font-medium">{{ getRestaurantName(role.restaurantId) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!disabled" class="space-y-3">
        <div 
          v-for="(role, index) in form.employeeRoles" 
          :key="index"
          class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <select
                :value="role.roleId"
                @change="updateRoleField(index, 'roleId', Number($event.target.value))"
                class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border-gray-300 dark:border-gray-600"
              >
                <option :value="null" disabled>Выберите роль</option>
                <option v-for="roleOpt in displayRoles" :key="roleOpt.id" :value="roleOpt.id">
                  {{ roleOpt.name }}
                </option>
              </select>
            </div>
            <div>
              <select
                :value="getSelectValue(role.restaurantId)"
                @change="updateRoleField(index, 'restaurantId', $event.target.value ? Number($event.target.value) : null)"
                class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border-gray-300 dark:border-gray-600"
                :disabled="!props.restaurants || props.restaurants.length === 0"
              >
                <option :value="''">Все рестораны</option>
                <option v-if="props.restaurants && props.restaurants.length" v-for="restaurant in props.restaurants" :key="restaurant.id" :value="restaurant.id">
                  {{ restaurant.name }}
                </option>
              </select>
            </div>
          </div>
          <button 
            type="button"
            @click="removeRole(index)"
            class="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>

        <button 
          type="button"
          @click="addRole"
          class="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Добавить роль</span>
        </button>
      </div>

      <div v-else class="text-sm text-gray-500 dark:text-gray-400">
        Роли не назначены
      </div>
    </div>

    <div v-if="showDetails && employee">
      <BaseLabel for="employee-created">Создано</BaseLabel>
      <BaseInput
        id="employee-created"
        :model-value="employee.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && employee">
      <BaseLabel for="employee-updated">Обновлено</BaseLabel>
      <BaseInput
        id="employee-updated"
        :model-value="employee.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500">
      {{ validationError }}
    </p>
  </div>
</template>
