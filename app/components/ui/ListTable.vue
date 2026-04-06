<script setup>
import { IconCheck, IconX, IconWarning } from '~/components/icons'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'Нет данных'
  },
  viewLinkPrefix: String,
  editLinkPrefix: String,
  showView: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  deleteLabel: {
    type: String,
    default: 'элемент'
  }
})

const emit = defineEmits(['row-click', 'delete'])

const router = useRouter()
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const handleRowClick = (id) => {
  emit('row-click', id)
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
  event.stopPropagation()
}

const handleDelete = async () => {
  emit('delete', itemToDelete.value)
  showDeleteModal.value = false
  itemToDelete.value = null
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const getViewLink = (item) => {
  if (!props.viewLinkPrefix) return null
  return `${props.viewLinkPrefix}/${item.id}`
}

const getEditLink = (item) => {
  if (!props.editLinkPrefix) return null
  return `${props.editLinkPrefix}/${item.id}/edit`
}

const getCellValue = (item, column) => {
  if (column.render) {
    return column.render(item)
  }
  const keys = column.key.split('.')
  let value = item
  for (const key of keys) {
    value = value?.[key]
  }
  return value ?? '—'
}

const getMobileValue = (item, column) => {
  if (column.mobileRender) {
    return column.mobileRender(item)
  }
  return getCellValue(item, column)
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else padding="none">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.key"
                :class="[
                  'px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                  column.key === 'actions' ? 'text-right' : 'text-left',
                  column.align === 'center' ? 'text-center' : '',
                  column.align === 'right' ? 'text-right' : '',
                  column.sticky ? 'sticky right-0 bg-gray-50 dark:bg-gray-700' : ''
                ]"
              >
                {{ column.key === 'actions' ? 'Действия' : column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="item in items" 
              :key="item.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              @click="handleRowClick(item.id)"
            >
              <td 
                v-for="column in columns" 
                :key="column.key"
                :class="[
                  'px-4 py-4 whitespace-nowrap text-sm select-text',
                  column.bold ? 'font-medium' : 'text-gray-500 dark:text-gray-400',
                  column.align === 'center' ? 'text-center' : '',
                  column.align === 'right' ? 'text-right' : '',
                  column.sticky ? 'sticky right-0 bg-white dark:bg-gray-800' : ''
                ]"
              >
                <component :is="column.component" v-if="column.component" :item="item" />
                <span v-else-if="column.key === 'actions'">
                  <UiActionListButtons
                    :view-link="getViewLink(item)"
                    :edit-link="getEditLink(item)"
                    :show-edit="showEdit"
                    :show-delete="showDelete"
                    @delete="confirmDelete(item)"
                  />
                </span>
                <span v-else v-html="getCellValue(item, column)"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="item in items" 
          :key="item.id" 
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div class="p-4" @click="handleRowClick(item.id)">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ID: {{ item.id }}</p>
            <template v-for="column in columns.filter(c => c.showInMobile !== false)" :key="column.key">
              <p v-if="column.mobileLabel" class="text-xs text-gray-500 dark:text-gray-400">
                <span v-html="getMobileValue(item, column)"></span>
              </p>
              <p v-else-if="!column.key.startsWith('actions') && !column.key.startsWith('id')" class="font-medium">
                <span v-html="getMobileValue(item, column)"></span>
              </p>
            </template>
          </div>
          <div class="px-4 pb-4">
            <UiActionListButtons
              :view-link="getViewLink(item)"
              :edit-link="getEditLink(item)"
              :show-edit="showEdit"
              :show-delete="showDelete"
              small
              @delete="confirmDelete(item)"
            />
          </div>
        </div>
        
        <div v-if="items.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          {{ emptyText }}
        </div>
      </div>
    </BaseCard>

    <BaseModal :show="showDeleteModal" @close="cancelDelete">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
          <IconWarning class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Удалить {{ deleteLabel }}
        </h3>

        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
          Вы уверены, что хотите удалить <strong>{{ itemToDelete?.name || itemToDelete?.title }}</strong>? Это действие нельзя отменить.
        </p>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="secondary" class="flex-1" @click="cancelDelete">
          Отмена
        </BaseButton>
        <BaseButton variant="danger" class="flex-1" :loading="loading" @click="handleDelete">
          Удалить
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
