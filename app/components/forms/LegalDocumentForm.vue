<script setup>
const props = defineProps({
  legalDocument: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String,
})

const emit = defineEmits(['handleFileUpload', 'update:link', 'update:fileInputRef'])

const fileInput = ref(null)

const form = defineModel({
  default: () => ({
    name: '',
    docFile: '',
    link: '',
    isActive: true
  })
})

const handleFileUpload = (event) => {
  emit('handleFileUpload', event)
}

const clearFile = () => {
  form.value.docFile = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:fileInputRef', fileInput.value)
}

onMounted(() => {
  emit('update:fileInputRef', fileInput.value)
})

const updateLink = (event) => {
  emit('update:link', event.target.value)
}
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

    <div>
      <BaseLabel>Файл документа</BaseLabel>
      <p class="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
        Загрузите файл документа (PDF, DOC, DOCX и т.д.)
      </p>
      
      <div v-if="!disabled && !showDetails" class="space-y-3">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span>Загрузить файл</span>
            <input 
              :ref="el => { fileInput = el }"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              class="hidden"
              @change="handleFileUpload"
            />
          </label>
          
          <button 
            v-if="form.docFile"
            type="button"
            @click="clearFile"
            class="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Очистить
          </button>
        </div>
      </div>

      <div v-if="form.docFile" class="mt-3">
        <div class="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ form.docFile }}</span>
        </div>
      </div>

      <div v-else-if="legalDocument?.docFile || legalDocument?.filePath" class="mt-3">
        <div class="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ legalDocument.docFile || legalDocument.filePath }}</span>
        </div>
      </div>
      <div v-else class="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Файл не загружен
      </div>
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
        :model-value="legalDocument.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && legalDocument">
      <BaseLabel for="legal-document-updated">Обновлено</BaseLabel>
      <BaseInput
        id="legal-document-updated"
        :model-value="legalDocument.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500">
      {{ validationError }}
    </p>
  </div>
</template>
