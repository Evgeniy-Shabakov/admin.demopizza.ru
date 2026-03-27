const MAX_RESTAURANT_EMPLOYEES_CONTROL_LEVEL = 500

export const ROLE = Object.freeze({
   SUPER_ADMIN: {
      ID: 999999999,
      NAME: 'super-admin',
      EMPLOYEES_CONTROL_LEVEL: 999999999
   },
   OWNER: {
      ID: 1,
      NAME: 'Владелец',
      DESCRIPTION: 'Доступны все возможности',
      EMPLOYEES_CONTROL_LEVEL: 1000,
   },
   MANAGER_GENERAL: {
      ID: 2,
      NAME: 'Управляющий всеми ресторанами',
      DESCRIPTION: 'Доступны все возможности, кроме манипуляций с данными владельца и данными других управляющих всеми ресторанами',
      EMPLOYEES_CONTROL_LEVEL: 900,
   },
   MANAGER_RESTAURANT: {
      ID: 3,
      NAME: 'Управляющий рестораном',
      DESCRIPTION: 'Доступны все возможности в рамках назначенного ресторана',
      EMPLOYEES_CONTROL_LEVEL: MAX_RESTAURANT_EMPLOYEES_CONTROL_LEVEL, 
   },
   ADMINISTRATOR_RESTAURANT: {
      ID: 4,
      NAME: 'Администратор ресторана',
      DESCRIPTION: 'Доступно изменение статусов заказов и изменение стоп-листа',
      EMPLOYEES_CONTROL_LEVEL: 400,
   },
   COURIER: {
      ID: 5,
      NAME: 'Курьер',
      DESCRIPTION: 'Доступно изменение статусов заказов на выполнено',
      EMPLOYEES_CONTROL_LEVEL: 100,
   },
})

export const getRoleName = (roleId) => {
   const roles = Object.values(ROLE)
   const role = roles.find(r => r.ID === roleId)
   return role?.NAME || 'Неизвестно'
}