<script setup>
import { IconView, IconEdit, IconTrash } from '~/components/icons'

defineProps({
  viewLink: String,
  editLink: String,
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
  small: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])
</script>

<template>
  <div :class="['flex gap-2', small ? '' : 'justify-end md:justify-end']" @click.stop>
    <NuxtLink
      v-if="showView && viewLink"
      :to="viewLink"
      :class="[
        'rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer',
        small ? 'p-1.5' : 'p-2',
        'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400',
        'inline-flex items-center gap-1.5 md:gap-0'
      ]"
      title="Просмотр"
    >
      <IconView class="w-4 h-4 md:w-4 md:h-4" />
      <span class="text-xs md:hidden">Просмотр</span>
    </NuxtLink>
    <NuxtLink
      v-if="showEdit && editLink"
      :to="editLink"
      :class="[
        'rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer',
        small ? 'p-1.5' : 'p-2',
        'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
        'inline-flex items-center gap-1.5 md:gap-0'
      ]"
      title="Редактировать"
    >
      <IconEdit class="w-4 h-4 md:w-4 md:h-4" />
      <span class="text-xs md:hidden">Редактировать</span>
    </NuxtLink>
    <button
      v-if="showDelete"
      @click="$emit('delete')"
      :class="[
        'rounded-lg hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer',
        small ? 'p-1.5' : 'p-2',
        'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400',
        'ml-auto md:ml-0'
      ]"
      title="Удалить"
    >
      <IconTrash class="w-4 h-4" />
    </button>
  </div>
</template>
