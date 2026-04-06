<script setup>
useHead({
   title: 'Редактирование правового документа'
})

const route = useRoute()
const documentId = route.params.id
const { getLegalDocument, updateLegalDocument, loading } = useLegalDocuments()
const { success: showSuccess } = useToast()

const fileInput = ref(null)

const form = ref({
   name: '',
   docFile: '',
   link: '',
   isActive: true
})

const legalDocument = ref(null)
const validationError = ref(null)

onMounted(async () => {
   legalDocument.value = await getLegalDocument(Number(documentId))
   if (legalDocument.value) {
      form.value.name = legalDocument.value.name
      form.value.link = legalDocument.value.link || ''
      form.value.isActive = legalDocument.value.isActive
      form.value.docFile = legalDocument.value.docFile || ''
   }
})

const handleFileUpload = (event) => {
   const file = event?.target?.files?.[0]
   if (file) {
      form.value.docFile = file.name
   }
}

const handleClearFile = () => {
   form.value.docFile = ''
   if (fileInput.value) {
      fileInput.value.value = ''
   }
}

const handleSubmit = async () => {
   if (!form.value.name) {
      validationError.value = 'Введите название документа'
      return
   }

   const hasNewFile = fileInput.value?.files?.[0]
   const existingFile = legalDocument.value?.docFile
   const hasLink = form.value.link && form.value.link.trim()

   if (!hasNewFile && !existingFile && !hasLink) {
      validationError.value = 'Добавьте файл документа или ссылку'
      return
   }

   const data = {
      name: form.value.name,
      link: form.value.link || '',
      isActive: form.value.isActive,
      docFile: hasNewFile || null
   }

   const result = await updateLegalDocument(Number(documentId), data)
   if (result.success) {
      showSuccess('Правовой документ успешно отредактирован')
      validationError.value = null
   } else if (result.validationError) {
      validationError.value = result.validationError
   }
}
</script>

<template>
   <div class="max-w-2xl">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
         <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Редактирование правового документа</h1>
         
         <div class="space-y-6">
            <div>
               <BaseLabel for="doc-name" required>Название</BaseLabel>
               <BaseInput
                  id="doc-name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Введите название документа"
               />
            </div>

            <div>
               <BaseLabel for="doc-link">Ссылка</BaseLabel>
               <BaseInput
                  id="doc-link"
                  v-model="form.link"
                  type="url"
                  placeholder="https://example.com/document"
               />
            </div>

            <div>
               <BaseLabel>Файл документа</BaseLabel>
               <p class="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Загрузите файл документа (PDF, DOC, DOCX и т.д.)
               </p>
               
               <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer transition-colors">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                     </svg>
                     <span>Загрузить файл</span>
                     <input 
                        ref="fileInput"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        class="hidden"
                        @change="handleFileUpload"
                     />
                  </label>
                  
                  <button 
                     v-if="form.docFile"
                     type="button"
                     @click="handleClearFile"
                     class="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                     Очистить
                  </button>
               </div>

               <div v-if="form.docFile" class="mt-3">
                  <div class="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                     <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                     </svg>
                     <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ form.docFile }}</span>
                  </div>
               </div>
               <div v-else-if="legalDocument?.docFile" class="mt-3">
                  <div class="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                     <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                     </svg>
                     <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ legalDocument.docFile }}</span>
                  </div>
               </div>
            </div>

            <div class="flex items-center gap-3">
               <BaseCheckbox v-model="form.isActive" />
               <span class="text-sm text-gray-700 dark:text-gray-300">Активен</span>
            </div>

            <p v-if="validationError" class="text-sm text-red-500">
               {{ validationError }}
            </p>
         </div>
         
         <div class="flex gap-4 mt-6">
            <button 
               type="button"
               @click="handleSubmit"
               :disabled="loading"
               class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors"
            >
               {{ loading ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <NuxtLink :to="`/legal-documents/${documentId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
               Отмена
            </NuxtLink>
         </div>
      </div>
   </div>
</template>
