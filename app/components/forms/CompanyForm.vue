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
    tagline: '',
    logoFile: null,
    faviconFile: null,
    phoneForOrders: '',
    aboutUs: '',
    contacts: '',
    linksSocial: '',
    isBonusCoinsEnabled: true
  })
})

const handleLogoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.logoFile = file
  }
}

const handleFaviconChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.faviconFile = file
  }
}

const logoPreview = computed(() => {
  if (form.value.logoFile) {
    return URL.createObjectURL(form.value.logoFile)
  }
  return null
})

const faviconPreview = computed(() => {
  if (form.value.faviconFile) {
    return URL.createObjectURL(form.value.faviconFile)
  }
  return null
})
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <BaseLabel for="company-name">Название компании</BaseLabel>
        <BaseInput
          v-if="disabled && company"
          id="company-name"
          :model-value="company.name"
          type="text"
          disabled
        />
        <BaseInput
          v-else
          id="company-name"
          v-model="form.name"
          type="text"
          :disabled="disabled"
          placeholder="Название компании"
        />
      </div>

      <div>
        <BaseLabel for="company-brand">Бренд</BaseLabel>
        <BaseInput
          v-if="disabled && company"
          id="company-brand"
          :model-value="company.brandName"
          type="text"
          disabled
        />
        <BaseInput
          v-else
          id="company-brand"
          v-model="form.brandName"
          type="text"
          :disabled="disabled"
          placeholder="Название бренда"
        />
      </div>
    </div>

    <div>
      <BaseLabel for="company-tagline">Слоган</BaseLabel>
      <BaseInput
        v-if="disabled && company"
        id="company-tagline"
        :model-value="company.tagline"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="company-tagline"
        v-model="form.tagline"
        type="text"
        :disabled="disabled"
        placeholder="Слоган компании"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <BaseLabel for="company-logo">Логотип</BaseLabel>
        <div v-if="disabled && company">
          <img 
            v-if="company.logoUrl" 
            :src="company.logoUrl" 
            alt="Логотип"
            class="w-32 h-32 object-contain rounded-lg"
          />
          <p v-else class="text-gray-500">Логотип не загружен</p>
        </div>
        <div v-else class="flex items-start gap-4">
          <div class="w-24 h-24 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
            <img
              v-if="logoPreview"
              :src="logoPreview"
              alt="Превью"
              class="w-full h-full object-contain"
            />
            <img
              v-else-if="company?.logoUrl"
              :src="company.logoUrl"
              alt="Текущий"
              class="w-full h-full object-contain"
            />
            <span v-else class="text-xs text-gray-400 text-center px-1">Нет логотипа</span>
          </div>
          <div class="flex-1">
            <input
              type="file"
              accept="image/*"
              @change="handleLogoChange"
              class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
            <p v-if="form.logoFile" class="mt-2 text-sm text-green-600">
              Выбран файл: {{ form.logoFile.name }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <BaseLabel for="company-favicon">Favicon</BaseLabel>
        <div v-if="disabled && company">
          <img 
            v-if="company.faviconUrl" 
            :src="company.faviconUrl" 
            alt="Favicon"
            class="w-16 h-16 object-contain rounded-lg"
          />
          <p v-else class="text-gray-500">Favicon не загружен</p>
        </div>
        <div v-else class="flex items-start gap-4">
          <div class="w-16 h-16 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
            <img
              v-if="faviconPreview"
              :src="faviconPreview"
              alt="Превью"
              class="w-full h-full object-contain"
            />
            <img
              v-else-if="company?.faviconUrl"
              :src="company.faviconUrl"
              alt="Текущий"
              class="w-full h-full object-contain"
            />
            <span v-else class="text-xs text-gray-400 text-center px-1">Нет</span>
          </div>
          <div class="flex-1">
            <input
              type="file"
              accept="image/*"
              @change="handleFaviconChange"
              class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
            <p v-if="form.faviconFile" class="mt-2 text-sm text-green-600">
              Выбран файл: {{ form.faviconFile.name }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <BaseLabel for="company-phone">Тефон для заказов</BaseLabel>
      <BaseInput
        v-if="disabled && company"
        id="company-phone"
        :model-value="company.phoneForOrders"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="company-phone"
        v-model="form.phoneForOrders"
        type="text"
        :disabled="disabled"
        placeholder="+7 (999) 123-45-67"
      />
    </div>

    <div>
      <BaseLabel for="company-about">О нас</BaseLabel>
      <BaseTextarea
        v-if="disabled && company"
        id="company-about"
        :model-value="company.aboutUs"
        :disabled="disabled"
        :rows="4"
      />
      <BaseTextarea
        v-else
        id="company-about"
        v-model="form.aboutUs"
        :disabled="disabled"
        :rows="4"
        placeholder="Информация о компании"
      />
    </div>

    <div>
      <BaseLabel for="company-contacts">Контакты</BaseLabel>
      <BaseTextarea
        v-if="disabled && company"
        id="company-contacts"
        :model-value="company.contacts"
        :disabled="disabled"
        :rows="3"
      />
      <BaseTextarea
        v-else
        id="company-contacts"
        v-model="form.contacts"
        :disabled="disabled"
        :rows="3"
        placeholder="Контактная информация"
      />
    </div>

    <div>
      <BaseLabel for="company-social">Социальные сети</BaseLabel>
      <BaseTextarea
        v-if="disabled && company"
        id="company-social"
        :model-value="company.linksSocial"
        :disabled="disabled"
        :rows="3"
      />
      <BaseTextarea
        v-else
        id="company-social"
        v-model="form.linksSocial"
        :disabled="disabled"
        :rows="3"
        placeholder="Ссылки на социальные сети"
      />
    </div>

    <div>
      <BaseCheckbox
        v-if="disabled && company"
        id="company-bonus"
        :model-value="company.isBonusCoinsEnabled"
        :disabled="disabled"
        label="Бонусные монеты включены"
      />
      <BaseCheckbox
        v-else
        id="company-bonus"
        v-model="form.isBonusCoinsEnabled"
        :disabled="disabled"
        label="Бонусные монеты включены"
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500 -mb-6">
      {{ validationError }}
    </p>
  </div>
</template>
