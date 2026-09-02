<script setup>
useHead({
   title: 'Главная'
})

const api = useApi()

const todayOrders = ref(0)
const currentMonthOrders = ref(0)
const previousMonthOrders = ref(0)
const loading = ref(true)

const toYMD = (date) => {
   const year = date.getFullYear()
   const month = String(date.getMonth() + 1).padStart(2, '0')
   const day = String(date.getDate()).padStart(2, '0')
   return `${year}-${month}-${day}`
}

const getMonthName = (monthIndex) => {
   const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
   ]
   return months[monthIndex]
}

const currentMonthName = ref('')
const previousMonthName = ref('')

const fetchOrderCounts = async () => {
   loading.value = true
   try {
      const today = new Date()

      currentMonthName.value = getMonthName(today.getMonth())
      previousMonthName.value = getMonthName(today.getMonth() - 1)

      const startOfToday = toYMD(today)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const startOfTomorrow = toYMD(tomorrow)

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1) // первый день следующего месяца
      const monthGte = toYMD(startOfMonth)
      const monthLt = toYMD(endOfMonth)

      const startOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 1) // первый день текущего месяца
      const prevMonthGte = toYMD(startOfPrevMonth)
      const prevMonthLt = toYMD(endOfPrevMonth)

      const todayFilter = JSON.stringify({
         createdAt: { gte: startOfToday, lte: startOfTomorrow }
      })

      const currentMonthFilter = JSON.stringify({
         createdAt: { gte: monthGte, lte: monthLt }
      })

      const previousMonthFilter = JSON.stringify({
         createdAt: { gte: prevMonthGte, lte: prevMonthLt }
      })

      // Выполняем параллельные запросы
      const [todayCount, currentMonthCount, previousMonthCount] = await Promise.all([
         api.get(`/orders/count`, { params: { filter: todayFilter } }),
         api.get(`/orders/count`, { params: { filter: currentMonthFilter } }),
         api.get(`/orders/count`, { params: { filter: previousMonthFilter } })
      ])

      todayOrders.value = todayCount.data.data
      currentMonthOrders.value = currentMonthCount.data.data
      previousMonthOrders.value = previousMonthCount.data.data
   } catch (e) {
      console.error(e)
   } finally {
      loading.value = false
   }
}

onMounted(fetchOrderCounts)
</script>

<template>
   <div class="space-y-6">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <DashboardStatCard title="Заказы сегодня"
                            :value="String(todayOrders)"
                            :change="loading ? 'Загрузка...' : 'На сегодня'"
                            change-type="positive"
                            icon-name="orders" />

         <DashboardStatCard :title="`Заказы за ${currentMonthName}`"
                            :value="String(currentMonthOrders)"
                            :change="loading ? '' : `${currentMonthOrders - previousMonthOrders > 0 ? '+' : ''}${currentMonthOrders - previousMonthOrders} к предыдущему месяцу`"
                            :change-type="currentMonthOrders >= previousMonthOrders ? 'positive' : 'negative'"
                            icon-name="orders" />

         <DashboardStatCard :title="`Заказы за ${previousMonthName}`"
                            :value="String(previousMonthOrders)"
                            :change="loading ? 'Загрузка...' : 'Предыдущий месяц'"
                            change-type="positive"
                            icon-name="orders" />
      </div>

      <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardActivityCard :items="activityItems" />
      <DashboardStatsProgressCard :stats="progressStats" />
    </div> -->
   </div>
</template>
