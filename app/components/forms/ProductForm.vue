<script setup>
import { useCategories } from '~/composables/useCategories'

defineProps({
  product: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    categoryId: null,
    priceDefault: null,
    bonusCoinsDefault: null,
    descriptionShort: '',
    descriptionFull: '',
    positionInCategory: null,
    imageFile: null,
    isActive: true
  })
})

const { categories, fetchCategories } = useCategories()

onMounted(() => {
  fetchCategories()
})

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.imageFile = file
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && product">
      <BaseLabel for="product-id">ID</BaseLabel>
      <BaseInput
        id="product-id"
        :model-value="product?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="product-name" required>Название</BaseLabel>
      <BaseInput
        v-if="disabled && product"
        id="product-name"
        :model-value="product.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="product-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        minlength="2"
        maxlength="100"
        placeholder="Введите название товара"
      />
    </div>

    <div>
      <BaseLabel for="product-category" required>Категория</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && product"
          id="product-category"
          :value="product.categoryId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select
          v-else
          id="product-category"
          v-model="form.categoryId"
          :disabled="disabled"
          required
          :class="[
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !form.categoryId && validationError 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <option :value="null" disabled>Выберите категорию</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <BaseLabel for="product-price" required>Цена</BaseLabel>
        <BaseInput
          v-if="disabled && product"
          id="product-price"
          :model-value="product.priceDefault"
          type="number"
          disabled
        />
        <BaseInput
          v-else
          id="product-price"
          v-model="form.priceDefault"
          type="number"
          :disabled="disabled"
          required
          min="0"
          step="0.01"
          placeholder="0.00"
        />
      </div>

      <div>
        <BaseLabel for="product-bonus">Бонусы</BaseLabel>
        <BaseInput
          v-if="disabled && product"
          id="product-bonus"
          :model-value="product.bonusCoinsDefault"
          type="number"
          disabled
        />
        <BaseInput
          v-else
          id="product-bonus"
          v-model="form.bonusCoinsDefault"
          type="number"
          :disabled="disabled"
          min="0"
          placeholder="0"
        />
      </div>
    </div>

    <div>
      <BaseLabel for="product-desc-short">Краткое описание</BaseLabel>
      <BaseTextarea
        v-if="disabled && product"
        id="product-desc-short"
        :model-value="product.descriptionShort"
        :disabled="disabled"
      />
      <BaseTextarea
        v-else
        id="product-desc-short"
        v-model="form.descriptionShort"
        :disabled="disabled"
        rows="3"
        maxlength="500"
        placeholder="Краткое описание товара"
      />
    </div>

    <div>
      <BaseLabel for="product-desc-full">Полное описание</BaseLabel>
      <BaseTextarea
        v-if="disabled && product"
        id="product-desc-full"
        :model-value="product.descriptionFull"
        :disabled="disabled"
        rows="6"
      />
      <BaseTextarea
        v-else
        id="product-desc-full"
        v-model="form.descriptionFull"
        :disabled="disabled"
        rows="6"
        maxlength="2000"
        placeholder="Полное описание товара"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <BaseLabel for="product-position">Позиция в категории</BaseLabel>
        <BaseInput
          v-if="disabled && product"
          id="product-position"
          :model-value="product.positionInCategory"
          type="number"
          disabled
        />
        <BaseInput
          v-else
          id="product-position"
          v-model="form.positionInCategory"
          type="number"
          :disabled="disabled"
          min="0"
          placeholder="0"
        />
      </div>

      <div>
        <BaseLabel for="product-image">Изображение</BaseLabel>
        <div v-if="disabled && product">
          <img 
            v-if="product.imageUrl" 
            :src="product.imageUrl" 
            :alt="product.name"
            class="w-32 h-32 object-cover rounded-lg"
          />
          <p v-else class="text-gray-500">Изображение не загружено</p>
        </div>
        <div v-else>
          <input
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />
          <p v-if="form.imageFile" class="mt-2 text-sm text-green-600">
            Выбран файл: {{ form.imageFile.name }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <BaseCheckbox
        v-if="disabled && product"
        id="product-active"
        :model-value="product.isActive"
        disabled
      >
        Активен
      </BaseCheckbox>
      <BaseCheckbox
        v-else
        id="product-active"
        v-model="form.isActive"
        :disabled="disabled"
      >
        Активен
      </BaseCheckbox>
    </div>

    <div v-if="showDetails && product">
      <BaseLabel for="product-created">Создано</BaseLabel>
      <BaseInput
        id="product-created"
        :model-value="product.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && product">
      <BaseLabel for="product-updated">Обновлено</BaseLabel>
      <BaseInput
        id="product-updated"
        :model-value="product.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500 -mb-6">
      {{ validationError }}
    </p>
  </div>
</template>
