export function useSidebar() {
  const isCollapsed = useState('sidebarCollapsed', () => false)

  const initSidebar = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('sidebarCollapsed')
      if (saved !== null) {
        isCollapsed.value = saved === 'true'
      }
    }
  }

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    if (import.meta.client) {
      localStorage.setItem('sidebarCollapsed', String(isCollapsed.value))
    }
  }

  return {
    isCollapsed: readonly(isCollapsed),
    initSidebar,
    toggleCollapse
  }
}
