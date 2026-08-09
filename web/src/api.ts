// Same-origin: movies.rivierenathan.fr serves both the front and /api/*
// (nginx proxies /api to the api container). VITE_API_BASE_URL is only
// needed to point at a different origin (e.g. local testing setups).
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || ''

export const apiUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}
