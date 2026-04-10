<script setup>
const props = defineProps({
  promocode: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String,
  isEdit: Boolean,
})

const form = defineModel({
  default: () => ({
    bonusCoins: null,
    description: '',
    isActive: true
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && promocode">
      <BaseLabel for="promocode-id">ID</BaseLabel>
      <BaseInput
        id="promocode-id"
        :model-value="promocode?.id"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && promocode">
      <BaseLabel for="promocode-code">Промокод</BaseLabel>
      <BaseInput
        id="promocode-code"
        :model-value="promocode?.code"
        type="text"
        disabled
      />
    </div>

    <div v-if="!isEdit">
      <BaseLabel for="promocode-bonus-coins" required>Бонусные монеты</BaseLabel>
      <BaseInput
        v-if="disabled && promocode"
        id="promocode-bonus-coins"
        :model-value="promocode.bonusCoins"
        type="number"
        disabled
      />
      <BaseInput
        v-else
        id="promocode-bonus-coins"
        v-model="form.bonusCoins"
        type="number"
        :disabled="disabled"
        required
        placeholder="Введите количество бонусных монет"
      />
    </div>

    <div v-if="!isEdit">
      <BaseLabel for="promocode-description">Описание</BaseLabel>
      <BaseTextarea
        v-if="disabled && promocode"
        id="promocode-description"
        :model-value="promocode.description"
        :disabled="disabled"
        :rows="3"
        :maxlength="500"
      />
      <BaseTextarea
        v-else
        id="promocode-description"
        v-model="form.description"
        :disabled="disabled"
        placeholder="Введите описание промокода"
        :rows="3"
        :maxlength="500"
      />
    </div>

    <div v-if="isEdit">
      <BaseLabel for="promocode-is-active">Активен</BaseLabel>
      <div class="flex items-center gap-3 mt-2">
        <BaseCheckbox
          :model-value="promocode ? promocode.isActive : form.isActive"
          :disabled="disabled"
          @update:model-value="form.isActive = $event"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ form.isActive ? 'Активен' : 'Неактивен' }}
        </span>
      </div>
    </div>

    <div v-if="showDetails && promocode && !isEdit">
      <BaseLabel for="promocode-is-active">Активен</BaseLabel>
      <div class="flex items-center gap-3 mt-2">
        <span :class="[
          'inline-flex px-2 py-1 rounded-full text-xs font-medium',
          promocode.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        ]">
          {{ promocode.isActive ? 'Активен' : 'Неактивен' }}
        </span>
      </div>
    </div>

    <div v-if="showDetails && promocode && promocode.employee">
      <BaseLabel for="promocode-employee">Сотрудник</BaseLabel>
      <BaseInput
        id="promocode-employee"
        :model-value="[promocode.employee.firstName, promocode.employee.lastName].filter(Boolean).join(' ') || promocode.employee.phone || '—'"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && promocode && promocode.user">
      <BaseLabel for="promocode-user">Применил</BaseLabel>
      <BaseInput
        id="promocode-user"
        :model-value="promocode.user.phone"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && promocode && promocode.usedAt">
      <BaseLabel for="promocode-used-at">Когда применил</BaseLabel>
      <BaseInput
        id="promocode-used-at"
        :model-value="new Date(promocode.usedAt).toLocaleString('ru-RU')"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && promocode">
      <BaseLabel for="promocode-created">Создано</BaseLabel>
      <BaseInput
        id="promocode-created"
        :model-value="promocode.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && promocode">
      <BaseLabel for="promocode-updated">Обновлено</BaseLabel>
      <BaseInput
        id="promocode-updated"
        :model-value="promocode.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500">
      {{ validationError }}
    </p>
  </div>
</template>