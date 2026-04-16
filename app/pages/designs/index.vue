<script setup>
useHead({
  title: 'Дизайны'
})

const router = useRouter()
const { designs, loading, fetchDesigns, deleteDesign } = useDesigns()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchDesigns()
})

const handleRowClick = (id) => {
  router.push(`/designs/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteDesign(item.id)
  if (result) {
    showSuccess('Дизайн успешно удален')
  }
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название', bold: true },
  {
    key: 'isActive',
    label: 'Активен',
    align: 'center',
    mobileLabel: 'Статус',
    render: (item) => item.isActive
       ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span>'
       : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span>'
  },
  {
    key: 'colors',
    label: 'Цвета',
    render: (item) => `<div class="flex flex-col gap-1">
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded border" style="background-color: ${item.settings?.backgroundPageMainColor || '#ffffff'}"></div>
        <span class="text-xs">${item.settings?.backgroundPageMainColor || '-'}</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded border" style="background-color: ${item.settings?.backgroundPageElementsColor || '#f3f4f6'}"></div>
        <span class="text-xs">${item.settings?.backgroundPageElementsColor || '-'}</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded border" style="background-color: ${item.settings?.brandColor || '#3b82f6'}"></div>
        <span class="text-xs">${item.settings?.brandColor || '-'}</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded border" style="background-color: ${item.settings?.textColorMain || '#1f2937'}"></div>
        <span class="text-xs">${item.settings?.textColorMain || '-'}</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded border" style="background-color: ${item.settings?.textColorOnBrandColor || '#ffffff'}"></div>
        <span class="text-xs">${item.settings?.textColorOnBrandColor || '-'}</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded border" style="background-color: ${item.settings?.textColorAccent || '#8b5cf6'}"></div>
        <span class="text-xs">${item.settings?.textColorAccent || '-'}</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded border" style="background-color: ${item.settings?.bottomNavColor || '#ffffff'}"></div>
        <span class="text-xs">${item.settings?.bottomNavColor || '-'}</span>
      </div>
    </div>`
  },
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="designs"
    :columns="columns"
    :loading="loading"
    empty-text="Дизайны не найдены"
    view-link-prefix="/designs"
    edit-link-prefix="/designs"
    delete-label="дизайн"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>