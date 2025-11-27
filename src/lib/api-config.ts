// Frontend API configuration
// NEXT_PUBLIC_ prefix makes this available in the browser
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
}

// Helper function to build API URLs
export function getApiUrl(path: string): string {
  // If baseUrl is empty (Next.js API routes), use relative path
  if (!apiConfig.baseUrl) {
    return path
  }

  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // Combine base URL with path
  return `${apiConfig.baseUrl}/${cleanPath}`
}
