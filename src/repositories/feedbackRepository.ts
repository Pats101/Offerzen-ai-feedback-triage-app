import { prisma } from '@/lib/prisma'
import { Feedback as PrismaFeedback } from '@prisma/client'
import { AIAnalysisResult } from '@/models/feedback'

/**
 * Data structure for creating feedback in database
 */
export interface CreateFeedbackData {
  text: string
  email: string | null
  analysis: AIAnalysisResult
}

/**
 * Query filters for listing feedback
 */
export interface FeedbackFilters {
  priority?: 'P0' | 'P1' | 'P2' | 'P3'
  sentiment?: 'positive' | 'neutral' | 'negative'
  tag?: string
}

/**
 * Repository layer for feedback database operations
 * Encapsulates all Prisma interactions
 */
export class FeedbackRepository {
  /**
   * Create a new feedback entry in the database
   */
  async create(data: CreateFeedbackData): Promise<PrismaFeedback> {
    return prisma.feedback.create({
      data: {
        text: data.text,
        email: data.email,
        summary: data.analysis.summary,
        sentiment: data.analysis.sentiment,
        priority: data.analysis.priority,
        tags: data.analysis.tags,
        nextAction: data.analysis.nextAction,
      },
    })
  }

  /**
   * Find a single feedback entry by ID
   */
  async findById(id: string): Promise<PrismaFeedback | null> {
    return prisma.feedback.findUnique({
      where: { id },
    })
  }

  /**
   * Find feedback entries with filters and pagination
   */
  async findMany(
    filters: FeedbackFilters,
    skip: number,
    take: number
  ): Promise<PrismaFeedback[]> {
    const where: any = {}
    if (filters.priority) where.priority = filters.priority
    if (filters.sentiment) where.sentiment = filters.sentiment
    if (filters.tag) where.tags = { has: filters.tag }

    return prisma.feedback.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Count feedback entries matching filters
   */
  async count(filters: FeedbackFilters): Promise<number> {
    const where: any = {}
    if (filters.priority) where.priority = filters.priority
    if (filters.sentiment) where.sentiment = filters.sentiment
    if (filters.tag) where.tags = { has: filters.tag }

    return prisma.feedback.count({ where })
  }
}

// Export singleton instance
export const feedbackRepository = new FeedbackRepository()
