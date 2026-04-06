<script setup>
defineProps({
  design: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    isActive: false,
    primaryColor: '#000000',
    secondaryColor: '#ffffff'
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && design">
      <BaseLabel for="design-id">ID</BaseLabel>
      <BaseInput
        id="design-id"
        :model-value="design?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="design-name" required>Название</BaseLabel>
      <BaseInput
        v-if="disabled && design"
        id="design-name"
        :model-value="design.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="design-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        minlength="2"
        maxlength="100"
        placeholder="Введите название дизайна"
      />
    </div>

    <div>
      <BaseLabel for="design-primary-color">Основной цвет</BaseLabel>
      <div class="flex gap-4 items-center">
        <input
          v-if="!disabled"
          type="color"
          id="design-primary-color"
          v-model="form.primaryColor"
          class="h-10 w-20 rounded cursor-pointer"
        />
        <div
          v-else
          class="h-10 w-20 rounded border"
          :style="{ backgroundColor: design?.settings?.primaryColor || '#000000' }"
        ></div>
        <BaseInput
          v-if="disabled && design"
          :model-value="design.settings?.primaryColor"
          type="text"
          disabled
          class="flex-1"
        />
        <BaseInput
          v-else
          v-model="form.primaryColor"
          type="text"
          :disabled="disabled"
          placeholder="#000000"
          class="flex-1"
        />
      </div>
    </div>

    <div>
      <BaseLabel for="design-secondary-color">Вторичный цвет</BaseLabel>
      <div class="flex gap-4 items-center">
        <input
          v-if="!disabled"
          type="color"
          id="design-secondary-color"
          v-model="form.secondaryColor"
          class="h-10 w-20 rounded cursor-pointer"
        />
        <div
          v-else
          class="h-10 w-20 rounded border"
          :style="{ backgroundColor: design?.settings?.secondaryColor || '#ffffff' }"
        ></div>
        <BaseInput
          v-if="disabled && design"
          :model-value="design.settings?.secondaryColor"
          type="text"
          disabled
          class="flex-1"
        />
        <BaseInput
          v-else
          v-model="form.secondaryColor"
          type="text"
          :disabled="disabled"
          placeholder="#ffffff"
          class="flex-1"
        />
      </div>
    </div>

    <div class="flex items-center gap-3">
      <BaseCheckbox
        :model-value="disabled && design ? design.isActive : form.isActive"
        :disabled="disabled"
        @update:model-value="form.isActive = $event"
      />
      <span class="text-sm text-gray-700 dark:text-gray-300">Активен</span>
    </div>

    <div v-if="showDetails && design">
      <BaseLabel for="design-created">Создано</BaseLabel>
      <BaseInput
        id="design-created"
        :model-value="design.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && design">
      <BaseLabel for="design-updated">Обновлено</BaseLabel>
      <BaseInput
        id="design-updated"
        :model-value="design.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500 -mb-6">
      {{ validationError }}
    </p>
  </div>
</template>