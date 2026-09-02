<script setup>
const props = defineProps({
  legalDocument: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String,
})

const form = defineModel({
  default: () => ({
    name: '',
    link: '',
    isActive: true
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && legalDocument">
      <BaseLabel for="legal-document-id">ID</BaseLabel>
      <BaseInput
        id="legal-document-id"
        :model-value="legalDocument?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="legal-document-name" required>Название</BaseLabel>
      <BaseInput
        v-if="disabled && legalDocument"
        id="legal-document-name"
        :model-value="legalDocument.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="legal-document-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        placeholder="Введите название документа"
      />
    </div>

    <div>
      <BaseLabel for="legal-document-link">Ссылка</BaseLabel>
      <BaseInput
        v-if="disabled && legalDocument"
        id="legal-document-link"
        :model-value="legalDocument.link"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="legal-document-link"
        :model-value="form.link"
        type="url"
        :disabled="disabled"
        placeholder="https://example.com/document"
        @update:model-value="form.link = $event"
      />
    </div>

    <div class="flex items-center gap-3">
      <BaseCheckbox
        :model-value="disabled && legalDocument ? legalDocument.isActive : form.isActive"
        :disabled="disabled"
        @update:model-value="form.isActive = $event"
      />
      <span class="text-sm text-gray-700 dark:text-gray-300">Активен</span>
    </div>

    <div v-if="showDetails && legalDocument">
      <BaseLabel for="legal-document-created">Создано</BaseLabel>
      <BaseInput
        id="legal-document-created"
        :model-value="formatDateTime(legalDocument.createdAt)"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && legalDocument">
      <BaseLabel for="legal-document-updated">Обновлено</BaseLabel>
      <BaseInput
        id="legal-document-updated"
        :model-value="formatDateTime(legalDocument.updatedAt)"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500">
      {{ validationError }}
    </p>
  </div>
</template>
