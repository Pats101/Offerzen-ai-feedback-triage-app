import { Feedback as PrismaFeedback } from '@prisma/client'
import { Feedback, PaginatedFeedbackResponse } from '@/models/feedback'

/**
 * Maps Prisma database model to API response model
 */
export function toFeedbackResponse(prismaFeedback: PrismaFeedback): Feedback {
  return {
    id: prismaFeedback.id,
    text: prismaFeedback.text,
    email: prismaFeedback.email,
    createdAt: prismaFeedback.createdAt,
    summary: prismaFeedback.summary,
    sentiment: prismaFeedback.sentiment as 'positive' | 'neutral' | 'negative',
    tags: prismaFeedback.tags,
    priority: prismaFeedback.priority as 'P0' | 'P1' | 'P2' | 'P3',
    nextAction: prismaFeedback.nextAction,
  }
}

/**
 * Maps array of Prisma models to paginated API response
 */
export function toPaginatedResponse(
  data: PrismaFeedback[],
  page: number,
  pageSize: number,
  total: number
): PaginatedFeedbackResponse {
  return {
    data: data.map(toFeedbackResponse),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}
