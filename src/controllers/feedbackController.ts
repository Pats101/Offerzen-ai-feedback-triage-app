import { logger } from '@/lib/logger'
import { analyzeFeedback } from '@/services/ai'
import { feedbackRepository } from '@/repositories/feedbackRepository'
import { toFeedbackResponse, toPaginatedResponse } from '@/mappers/feedbackMapper'
import { Feedback, PaginatedFeedbackResponse } from '@/models/feedback'
import { CreateFeedbackInput, ListFeedbackQuery } from '@/validators/feedbackValidator'

/**
 * Feedback Controller
 * Orchestrates business logic flow without direct database or AI implementation details
 */
export class FeedbackController {
  /**
   * Create new feedback with AI analysis
   */
  async createFeedback(input: CreateFeedbackInput): Promise<Feedback> {
    // Get AI analysis
    const analysis = await analyzeFeedback(input.text)

    // Store in database
    const feedbackData = await feedbackRepository.create({
      text: input.text,
      email: input.email || null,
      analysis,
    })

    logger.info('Feedback created', { id: feedbackData.id })

    // Map to response format
    return toFeedbackResponse(feedbackData)
  }

  /**
   * Get a single feedback by ID
   */
  async getFeedbackById(id: string): Promise<Feedback | null> {
    const feedbackData = await feedbackRepository.findById(id)

    if (!feedbackData) {
      return null
    }

    logger.info('Feedback retrieved', { id })

    // Map to response format
    return toFeedbackResponse(feedbackData)
  }

  /**
   * List feedback with filters and pagination
   */
  async listFeedback(query: ListFeedbackQuery): Promise<PaginatedFeedbackResponse> {
    const { page, pageSize, priority, sentiment, tag } = query

    // Calculate pagination offset
    const skip = (page - 1) * pageSize

    // Build filters
    const filters = { priority, sentiment, tag }

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      feedbackRepository.findMany(filters, skip, pageSize),
      feedbackRepository.count(filters),
    ])

    logger.info('Feedback list fetched', { page, pageSize, total })

    // Map to response format
    return toPaginatedResponse(data, page, pageSize, total)
  }
}

// Export singleton instance
export const feedbackController = new FeedbackController()
