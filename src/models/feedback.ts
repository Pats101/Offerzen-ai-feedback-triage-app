// Type definitions for feedback system

export interface Feedback {
  id: string
  content: string
  category: string | null
  priority: string | null
  tags: string[]
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateFeedbackInput {
  content: string
}

// Result from AI analysis
export interface AIAnalysisResult {
  category: string
  priority: string
  tags: string[]
}

// TODO: add validation schemas using Zod
// TODO: consider adding user/author field to feedback model
