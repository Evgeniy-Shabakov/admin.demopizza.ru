export const useToast = () => {
  const toasts = useState('toasts', () => [])
  const toastId = useState('toastId', () => 0)

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = ++toastId.value
    const toast = typeof message === 'string' 
      ? { message, details: null } 
      : message
    toasts.value = [...toasts.value, { id, ...toast, type }]
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (message) => addToast(message, 'success')
  const error = (message, details = null, statusCode = null) => {
    const toastData = typeof message === 'object' && message !== null
      ? message
      : { message, details, statusCode }
    addToast(toastData, 'error', 0)
  }
  const info = (message) => addToast(message, 'info')
  const showToast = (message, type = 'info') => addToast(message, type)

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    info,
    showToast
  }
}
