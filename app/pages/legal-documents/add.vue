<script setup>
useHead({
   title: 'Добавить правовой документ'
})

const router = useRouter()
const { createLegalDocument, loading } = useLegalDocuments()
const { success: showSuccess, error: showError } = useToast()

const form = ref({
   name: '',
   link: '',
   isActive: true
})

const validationError = ref(null)

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

   const result = await createLegalDocument(data)
   if (result.success) {
      showSuccess('Правовой документ успешно создан')
      navigateTo('/legal-documents')
   }
}

const handleCancel = () => {
   navigateTo('/legal-documents')
}
</script>

<template>
   <div class="max-w-2xl">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
         <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Добавить правовой документ</h1>
         
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
            <button 
               type="button"
               @click="handleCancel"
               class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
               Отмена
            </button>
         </div>
      </div>
   </div>
</template>
