// Type definitions for feedback system

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

export interface CreateFeedbackInput {
  text: string
  email?: string
}

// Result from AI analysis
export interface AIAnalysisResult {
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  nextAction: string
}

// Query parameters for listing feedback
export interface ListFeedbackQuery {
  page?: number
  limit?: number
  priority?: 'P0' | 'P1' | 'P2' | 'P3'
  sentiment?: 'positive' | 'neutral' | 'negative'
}

// Paginated response for listing feedback
export interface PaginatedFeedbackResponse {
  data: Feedback[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// TODO: add validation schemas using Zod
