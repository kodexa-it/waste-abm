export function getMediaUrl(path?: string) {
  if (!path) return ''

  if (
    path.startsWith('blob:') ||
    path.startsWith('http') ||
    path.startsWith('data:')
  ) {
    return path
  }

  return `${process.env.NEXT_PUBLIC_MEDIA_URL}${path}`
}