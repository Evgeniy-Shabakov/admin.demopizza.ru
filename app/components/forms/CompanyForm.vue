<script setup>
import { computed } from 'vue'
import { PAYMENT_TYPE } from '~/constants/paymentType'

const props = defineProps({
   company: Object,
   disabled: Boolean,
   validationError: String
})

const form = defineModel({
   default: () => ({
      name: '',
      brandName: '',
      inn: '',
      ogrnip: '',
      address: '',
      legalDataPhone: '',
      tagline: '',
      phoneForOrders: '',
      isBonusCoinsEnabled: true,
      paymentTypeSetting: {
         enabledPaymentTypeIds: [],
         paymentTypeIdByDefault: null
      }
   })
})

const paymentTypes = Object.values(PAYMENT_TYPE)

const enabledPaymentTypes = computed(() =>
   paymentTypes.filter(pt => form.value.paymentTypeSetting?.enabledPaymentTypeIds?.includes(pt.ID))
)

const enabledCompanyPaymentTypes = computed(() =>
   paymentTypes.filter(pt => props.company?.options?.paymentTypeSetting?.enabledPaymentTypeIds?.includes(pt.ID))
)

const isPaymentTypeEnabled = (paymentTypeId) =>
   form.value.paymentTypeSetting?.enabledPaymentTypeIds?.includes(paymentTypeId) || false

const isCompanyPaymentTypeEnabled = (paymentTypeId) =>
   props.company?.options?.paymentTypeSetting?.enabledPaymentTypeIds?.includes(paymentTypeId) || false

const togglePaymentType = (paymentTypeId, checked) => {
   if (!form.value.paymentTypeSetting) {
      form.value.paymentTypeSetting = { enabledPaymentTypeIds: [], paymentTypeIdByDefault: null }
   }
   const settings = form.value.paymentTypeSetting
   const enabledIds = settings.enabledPaymentTypeIds
   if (checked) {
      if (!enabledIds.includes(paymentTypeId)) {
         enabledIds.push(paymentTypeId)
      }
      if (settings.paymentTypeIdByDefault === null) {
         settings.paymentTypeIdByDefault = paymentTypeId
      }
   } else {
      const index = enabledIds.indexOf(paymentTypeId)
      if (index !== -1) enabledIds.splice(index, 1)
      if (settings.paymentTypeIdByDefault === paymentTypeId) {
         settings.paymentTypeIdByDefault = enabledIds.length ? enabledIds[0] : null
      }
   }
}

</script>

<template>
   <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <BaseLabel for="company-name">Название компании</BaseLabel>
            <BaseInput v-if="disabled && company"
                       id="company-name"
                       :model-value="company.name"
                       type="text"
                       disabled />
            <BaseInput v-else
                       id="company-name"
                       v-model="form.name"
                       type="text"
                       :disabled="disabled"
                       placeholder="Название компании" />
         </div>

         <div>
            <BaseLabel for="company-brand">Бренд</BaseLabel>
            <BaseInput v-if="disabled && company"
                       id="company-brand"
                       :model-value="company.brandName"
                       type="text"
                       disabled />
            <BaseInput v-else
                       id="company-brand"
                       v-model="form.brandName"
                       type="text"
                       :disabled="disabled"
                       placeholder="Название бренда" />
         </div>
      </div>

      <div>
         <BaseLabel for="company-inn">ИНН</BaseLabel>
         <BaseInput v-if="disabled && company"
                    id="company-inn"
                    :model-value="company.legalData?.inn"
                    type="text"
                    disabled />
         <BaseInput v-else
                    id="company-inn"
                    v-model="form.inn"
                    type="text"
                    :disabled="disabled" />
      </div>

      <div>
         <BaseLabel for="company-ogrnip">ОГРНИП</BaseLabel>
         <BaseInput v-if="disabled && company"
                    id="company-ogrnip"
                    :model-value="company.legalData?.ogrnip"
                    type="text"
                    disabled />
         <BaseInput v-else
                    id="company-ogrnip"
                    v-model="form.ogrnip"
                    type="text"
                    :disabled="disabled" />
      </div>

      <div>
         <BaseLabel for="company-address">Адрес</BaseLabel>
         <BaseInput v-if="disabled && company"
                    id="company-address"
                    :model-value="company.legalData?.address"
                    type="text"
                    disabled />
         <BaseInput v-else
                    id="company-address"
                    v-model="form.address"
                    type="text"
                    :disabled="disabled" />
      </div>

      <div>
         <BaseLabel for="company-legalDataPhone">Контактный телефон</BaseLabel>
         <BaseInput v-if="disabled && company"
                    id="company-legalDataPhone"
                    :model-value="company.legalData?.legalDataPhone"
                    type="text"
                    disabled />
         <BaseInput v-else
                    id="company-legalDataPhone"
                    v-model="form.legalDataPhone"
                    type="text"
                    :disabled="disabled" />
      </div>

      <div>
         <BaseLabel for="company-tagline">Слоган</BaseLabel>
         <BaseInput v-if="disabled && company"
                    id="company-tagline"
                    :model-value="company.tagline"
                    type="text"
                    disabled />
         <BaseInput v-else
                    id="company-tagline"
                    v-model="form.tagline"
                    type="text"
                    :disabled="disabled"
                    placeholder="Слоган компании" />
      </div>

      <div>
         <BaseLabel for="company-phone">Тефон для заказов</BaseLabel>
         <BaseInput v-if="disabled && company"
                    id="company-phone"
                    :model-value="company.phoneForOrders"
                    type="text"
                    disabled />
         <BaseInput v-else
                    id="company-phone"
                    v-model="form.phoneForOrders"
                    type="text"
                    :disabled="disabled"
                    placeholder="+7 (999) 123-45-67" />
      </div>

      <div>
         <BaseCheckbox v-if="disabled && company"
                       id="company-bonus"
                       :model-value="company.options?.isBonusCoinsEnabled"
                       :disabled="disabled"
                       label="Активировать бонусную программу" />
         <BaseCheckbox v-else
                       id="company-bonus"
                       v-model="form.isBonusCoinsEnabled"
                       :disabled="disabled"
                       label="Бонусные монеты включены" />
      </div>

      <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
         <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Настройка типов оплаты
         </h3>

         <div class="space-y-3">
            <div v-for="paymentType in paymentTypes"
                 :key="paymentType.ID"
                 class="flex items-center justify-between">
               <BaseCheckbox v-if="disabled && company"
                             :model-value="isCompanyPaymentTypeEnabled(paymentType.ID)"
                             :disabled="disabled"
                             :label="paymentType.NAME" />
               <BaseCheckbox v-else
                             :model-value="isPaymentTypeEnabled(paymentType.ID)"
                             :disabled="disabled"
                             :label="paymentType.NAME"
                             @update:model-value="togglePaymentType(paymentType.ID, $event)" />
            </div>

            <div class="pt-2">
               <BaseLabel for="company-default-payment-type">Тип оплаты по умолчанию</BaseLabel>
               <select v-if="disabled && company"
                       id="company-default-payment-type"
                       :value="company.options?.paymentTypeSetting?.paymentTypeIdByDefault"
                       disabled
                       class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                  <option v-for="paymentType in enabledCompanyPaymentTypes"
                          :key="paymentType.ID"
                          :value="paymentType.ID">
                     {{ paymentType.NAME }}
                  </option>
               </select>
               <select v-else
                       id="company-default-payment-type"
                       :value="form.paymentTypeSetting?.paymentTypeIdByDefault"
                       :disabled="disabled || enabledPaymentTypes.length === 0"
                       class="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border-gray-300 dark:border-gray-600"
                       @change="form.paymentTypeSetting.paymentTypeIdByDefault = Number($event.target.value)">
                  <option :value="null" disabled>Выберите тип оплаты</option>
                  <option v-for="paymentType in enabledPaymentTypes"
                          :key="paymentType.ID"
                          :value="paymentType.ID">
                     {{ paymentType.NAME }}
                  </option>
               </select>
            </div>
         </div>
      </div>

      <p v-if="validationError"
         class="text-sm text-red-500 -mb-6">
         {{ validationError }}
      </p>
   </div>
</template>
