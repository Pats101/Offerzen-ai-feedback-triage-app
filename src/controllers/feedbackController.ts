import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { analyzeFeedback } from '@/services/ai'
import {
  CreateFeedbackInput,
  Feedback,
  ListFeedbackQuery,
  PaginatedFeedbackResponse,
} from '@/models/feedback'

// Basic feedback controller - starting with create and read operations
export class FeedbackController {

  async createFeedback(input: CreateFeedbackInput): Promise<Feedback> {
    // TODO: add input validation before calling AI service
    const analysis = await analyzeFeedback(input.text)

    // Store in database with AI-generated metadata
    const feedback = await prisma.feedback.create({
      data: {
        text: input.text,
        email: input.email || null,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        priority: analysis.priority,
        tags: analysis.tags,
        nextAction: analysis.nextAction,
      },
    })

    logger.info('Feedback created', { id: feedback.id })
    return feedback
  }


  async listFeedback(query: ListFeedbackQuery = {}): Promise<PaginatedFeedbackResponse> {
    const { page = 1, limit = 10, priority, sentiment } = query

    // Build filter conditions
    const where: any = {}
    if (priority) where.priority = priority
    if (sentiment) where.sentiment = sentiment

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.feedback.count({ where }),
    ])

    logger.info('Feedback list fetched', { page, limit, total })

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // TODO: implement updateFeedback for status changes
  // async updateFeedback(id: string, input: UpdateFeedbackInput)

  // TODO: implement deleteFeedback (soft delete?)
}

export const feedbackController = new FeedbackController()
