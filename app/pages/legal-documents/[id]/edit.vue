<script setup>
useHead({
   title: 'Редактирование правового документа'
})

const route = useRoute()
const documentId = route.params.id
const { getLegalDocument, updateLegalDocument, loading } = useLegalDocuments()
const { success: showSuccess } = useToast()

const form = ref({
   name: '',
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
   }
})

const handleSubmit = async () => {
   if (!form.value.name) {
      validationError.value = 'Введите название документа'
      return
   }

   if (!form.value.link) {
      validationError.value = 'Добавьте ссылку на документ'
      return
   }

   const data = {
      name: form.value.name,
      link: form.value.link || '',
      isActive: form.value.isActive
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
               <BaseLabel for="doc-link" required>Ссылка</BaseLabel>
               <BaseInput
                  id="doc-link"
                  v-model="form.link"
                  type="url"
                  required
                  placeholder="https://example.com/document"
               />
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
