export function useTheme() {
  const theme = useState('theme', () => 'dark')

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme')
      
      if (savedTheme) {
        theme.value = savedTheme
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme.value = 'dark'
      }
      applyTheme()
    }
  }

  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  return {
    theme: readonly(theme),
    toggleTheme,
    initTheme
  }
}
