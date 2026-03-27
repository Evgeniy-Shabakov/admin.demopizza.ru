# AGENTS.md - Development Guidelines for Agents

## Project Overview
- **Framework**: Nuxt.js 4.x with Vue 3 Composition API
- **Styling**: Tailwind CSS v4
- **API Client**: Axios
- **Type**: SPA (ssr: false in nuxt.config.js)

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

**Note**: No test framework is currently configured. There are no test files in this project.

## Code Style Guidelines

### Vue Components
- Use `<script setup>` syntax with Composition API
- Use `defineProps` and `defineEmits` for component interfaces
- Place props and emits at the top of `<script setup>` blocks
- Use TypeScript-like patterns for props (even in plain JS files)

Example:
```vue
<script setup>
defineProps({
  title: String,
  items: Array,
  isLoading: Boolean
})

defineEmits(['update', 'delete'])
</script>
```

### Template Structure
- Use self-closing tags for components with no content
- Use kebab-case for HTML attributes and props passed to components
- Use Tailwind utility classes for all styling (no custom CSS unless necessary)
- Support dark mode by including both `light` and `dark:` variants

Example:
```vue
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

### File Organization (Nuxt App Directory)
```
app/
├── assets/css/     # Global styles (main.css)
├── components/     # Vue components (use ui/ or layout/ subdirectories)
├── composables/    # Reusable composition functions (use*.js)
├── config/         # App configuration
├── layouts/        # Page layouts
├── middleware/     # Route middleware
├── pages/          # Route pages with dynamic routes using [id]/
├── plugins/        # Nuxt plugins
```

### Naming Conventions
- **Components**: PascalCase (e.g., `PhoneInput.vue`, `Sidebar.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useApi.js`, `useAuth.js`)
- **Files**: kebab-case for everything except components
- **Vue component folders**: Flat structure or simple subdirectories (ui/, layout/)

### Imports
- Nuxt auto-imports: `useRoute`, `useRouter`, `useNuxtApp`, `useHead`, etc.
- Composables from `app/composables/` are auto-imported via `use*` prefix
- Access injected plugin via `useNuxtApp().$api`

### API/Network
- Use the `useApi()` composable for HTTP requests
- API instance is configured via plugin at `app/plugins/api.js`
- Use runtime config for environment variables: `useRuntimeConfig().public.apiBaseUrl`

### Error Handling
- Use `try/catch` blocks for async operations
- Display errors via toast notifications using `useToast()` composable
- Log errors to console for debugging

### Tailwind CSS Guidelines
- Use Tailwind v4 syntax (no `@apply` directive, direct utility classes)
- Use `dark:` variant for dark mode support on all color utilities
- Avoid hardcoded colors - use Tailwind's color palette
- Use responsive prefixes: `md:`, `lg:`, `xl:` for responsive design

### Language
- UI text and comments in Russian
- Code/variable names in English

## Common Patterns

### Page with API data:
```vue
<script setup>
const api = useApi()
const data = ref(null)

onMounted(async () => {
  try {
    data.value = await api.get('/endpoint')
  } catch (e) {
    console.error(e)
  }
})
</script>
```

### Conditional classes:
```vue
<template>
  <div :class="[
    'base-class',
    isActive ? 'active-class' : 'inactive-class'
  ]">
</template>
```

### Using NuxtLink:
```vue
<NuxtLink to="/path" class="text-blue-500 hover:underline">
```

## Environment Variables
- `API_BASE_URL` - Base URL for API (configured in runtimeConfig.public)

## Development Notes
- This is an admin panel SPA (client-side only)
- Routes are protected by auth middleware (auth.global.js)
- Theme switching is available via `useTheme()` composable
- Country routes use dynamic segments: `countries/[id]/index.vue`, `countries/[id]/edit.vue`