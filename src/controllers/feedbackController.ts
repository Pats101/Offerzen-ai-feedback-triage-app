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
   * List feedback with filters and pagination
   */
  async listFeedback(query: ListFeedbackQuery): Promise<PaginatedFeedbackResponse> {
    const { page, limit, priority, sentiment } = query

    // Calculate pagination offset
    const skip = (page - 1) * limit

    // Build filters
    const filters = { priority, sentiment }

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      feedbackRepository.findMany(filters, skip, limit),
      feedbackRepository.count(filters),
    ])

    logger.info('Feedback list fetched', { page, limit, total })

    // Map to response format
    return toPaginatedResponse(data, page, limit, total)
  }
}

// Export singleton instance
export const feedbackController = new FeedbackController()
