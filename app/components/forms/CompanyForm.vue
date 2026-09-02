<script setup>
import { computed } from 'vue'

defineProps({
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
      isBonusCoinsEnabled: true
   })
})

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

      <p v-if="validationError"
         class="text-sm text-red-500 -mb-6">
         {{ validationError }}
      </p>
   </div>
</template>
