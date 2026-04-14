<script setup>
useHead({
  title: 'Главная'
})

// const activityItems = [
//   { initials: 'П1', action: 'Действие пользователя 1', time: '2 мин. назад' },
//   { initials: 'П2', action: 'Действие пользователя 2', time: '4 мин. назад' },
//   { initials: 'П3', action: 'Действие пользователя 3', time: '6 мин. назад' },
//   { initials: 'П4', action: 'Действие пользователя 4', time: '8 мин. назад' },
//   { initials: 'П5', action: 'Действие пользователя 5', time: '10 мин. назад' }
// ]

// const progressStats = [
//   { label: 'Нагрузка сервера', value: 67, colorClass: 'bg-indigo-600' },
//   { label: 'Использование памяти', value: 45, colorClass: 'bg-green-600' },
//   { label: 'Место на диске', value: 82, colorClass: 'bg-orange-600' }
// ]
</script>

<template>
  <div class="space-y-6">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        title="Всего пользователей"
        value="1,234"
        change="+12% за прошлый месяц"
        change-type="positive"
        icon-name="users"
      />

      <DashboardStatCard
        title="Заказы"
        value="567"
        change="-3% за прошлый месяц"
        change-type="negative"
        icon-name="orders"
      />
    </div>

    <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardActivityCard :items="activityItems" />
      <DashboardStatsProgressCard :stats="progressStats" />
    </div> -->
  </div>
</template>
