// Type definitions for feedback system domain models

/**
 * Core feedback entity
 */
export interface Feedback {
  id: string
  text: string
  email: string | null
  createdAt: Date
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  nextAction: string
}

/**
 * Result from AI analysis service
 */
export interface AIAnalysisResult {
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  nextAction: string
}

/**
 * Paginated response for listing feedback
 */
export interface PaginatedFeedbackResponse {
  data: Feedback[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
