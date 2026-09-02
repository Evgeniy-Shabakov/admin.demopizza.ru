<script setup>
useHead({
   title: 'Просмотр правового документа'
})

const route = useRoute()
const documentId = route.params.id
const { getLegalDocument, loading } = useLegalDocuments()

const legalDocument = ref(null)

onMounted(async () => {
   legalDocument.value = await getLegalDocument(Number(documentId))
})
</script>

<template>
   <div class="space-y-6 max-w-2xl">
      <div v-if="loading" class="flex items-center justify-center py-12">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <BaseCard v-else-if="legalDocument">
         <FormsLegalDocumentForm 
            :legal-document="legalDocument" 
            disabled 
            :show-details="true" 
         />
      </BaseCard>

      <BaseCard v-else>
         <p class="text-gray-500 dark:text-gray-400 text-center">Правовой документ не найден</p>
      </BaseCard>
   </div>
</template>
