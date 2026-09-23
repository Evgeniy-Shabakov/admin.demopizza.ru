export const useServerOrigin = () => {
  const hostname = window.location.hostname
  return hostname.startsWith('admin.')
    ? `https://${hostname.slice(6)}`
    : 'http://localhost:5000'
}

export const useApiBaseUrl = () => `${useServerOrigin()}/api/v1/admin`