<template>
   <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-sm">
         А
      </div>
      <div class="flex flex-col">
         <span class="text-sm font-medium leading-tight">Админ</span>
         <span class="text-xs text-gray-500 dark:text-gray-400">Администратор</span>
      </div>
   </div>
   <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
           title="Выйти">
      <svg class="w-5 h-5"
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24">
         <path stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2"
               d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
   </button>
</template>