export function paramCase (str) {
  return str
    .replace(/(\W|_)/g, '-')
    .replace(/([A-Z])/g, s => '-' + s.toLowerCase())
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}
