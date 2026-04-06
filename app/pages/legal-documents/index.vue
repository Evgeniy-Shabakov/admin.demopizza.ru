<script setup>
import { useRuntimeConfig } from '#app'

useHead({
   title: 'Правовые документы'
})

const router = useRouter()
const { legalDocuments, loading, fetchLegalDocuments, deleteLegalDocument } = useLegalDocuments()
const { success: showSuccess } = useToast()

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')

const getFileUrl = (filePath) => {
    if (!filePath) return null
    return filePath.replace('storage/public', apiBaseUrl)
}

const getDocFile = (item) => {
    return item.docFile || item.filePath || null
}

onMounted(() => {
   fetchLegalDocuments()
})

const handleRowClick = (id) => {
   router.push(`/legal-documents/${id}`)
}

const handleDelete = async (item) => {
   const result = await deleteLegalDocument(item.id)
   if (result) {
      showSuccess('Правовой документ успешно удалён')
   }
}

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Название', bold: true },
    { key: 'link', label: 'Ссылка', render: (item) => item.link ? `<a href="${item.link}" target="_blank" onclick="event.stopPropagation()" class="text-indigo-600 dark:text-indigo-400 hover:underline truncate block max-w-xs">${item.link}</a>` : '—' },
    {
        key: 'docFile',
        label: 'Файл',
        render: (item) => {
            const filePath = getDocFile(item)
            const url = getFileUrl(filePath)
            if (!url) return '<span class="text-gray-400">—</span>'
            const fileName = filePath.split('/').pop()
            return `<a href="${url}" target="_blank" onclick="event.stopPropagation()" class="text-indigo-600 dark:text-indigo-400 hover:underline">${fileName}</a>`
        }
     },
    {
       key: 'isActive',
       label: 'Активен',
       align: 'center',
       mobileLabel: 'Статус',
       render: (item) => item.isActive
          ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span>'
          : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span>'
    },
   { key: 'createdAt', label: 'Создано', showInMobile: false },
   { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
   { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
   <UiListTable :items="legalDocuments"
                :columns="columns"
                :loading="loading"
                empty-text="Правовые документы не найдены"
                view-link-prefix="/legal-documents"
                edit-link-prefix="/legal-documents"
                delete-label="правовой документ"
                @row-click="handleRowClick"
                @delete="handleDelete" />
</template>
