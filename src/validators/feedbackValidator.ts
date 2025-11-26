import { z } from 'zod'

// Schema for creating feedback
export const createFeedbackSchema = z.object({
  text: z.string().min(1, 'Feedback text is required').max(5000, 'Feedback text is too long'),
  email: z.string().email('Invalid email address').optional(),
})

// Schema for listing feedback (query parameters)
export const listFeedbackQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(10),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  tag: z.string().min(1).optional(),
})

// Schema for getting feedback by ID
export const feedbackIdSchema = z.object({
  id: z.string().cuid('Invalid feedback ID format'),
})

// Type inference from schemas
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>
export type ListFeedbackQuery = z.infer<typeof listFeedbackQuerySchema>
export type FeedbackIdInput = z.infer<typeof feedbackIdSchema>
