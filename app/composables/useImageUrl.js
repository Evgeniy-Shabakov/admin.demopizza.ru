export const useImageUrl = () => {
  const config = useRuntimeConfig()
  const base = new URL(config.public.apiBaseUrl).origin

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null
    return encodeURI(imagePath.replace('storage/public', base))
  }

  return { getImageUrl }
}
