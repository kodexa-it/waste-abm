export function getMediaUrl(path?: string) {
  if (!path) return ''

  // ya es URL completa → devolver directo
  if (
    path.startsWith('http') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path
  }

  // fallback (por si queda algo viejo tipo /uploads)
  return `${process.env.NEXT_PUBLIC_MEDIA_URL}${path}`
}