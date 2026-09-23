import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
   app: {
      head: {
         link: [
            { rel: 'manifest', href: '/manifest.webmanifest' }
         ]
      }
   },
  components: true,
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  }
})
