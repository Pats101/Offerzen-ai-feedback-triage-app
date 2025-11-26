import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { analyzeFeedback } from '@/services/ai'
import { CreateFeedbackInput, Feedback } from '@/models/feedback'

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


  // TODO: implement listFeedback with pagination
  // async listFeedback(params?: { skip?: number; take?: number; status?: string })

  // TODO: implement updateFeedback for status changes
  // async updateFeedback(id: string, input: UpdateFeedbackInput)

  // TODO: implement deleteFeedback (soft delete?)
}

export const feedbackController = new FeedbackController()
