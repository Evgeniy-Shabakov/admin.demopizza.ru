export const useImageUrl = () => {
  const base = useServerOrigin()

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null
    return encodeURI(imagePath.replace('storage/public', base))
  }

  return { getImageUrl }
}
