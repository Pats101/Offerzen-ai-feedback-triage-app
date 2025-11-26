import type { NextApiRequest, NextApiResponse } from 'next'
import { feedbackController } from '@/controllers/feedbackController'
import {
  createFeedbackSchema,
  listFeedbackQuerySchema,
} from '@/validators/feedbackValidator'
import { ZodError } from 'zod'

/**
 * API Route Handler for /api/feedback
 * Thin routing layer - only handles HTTP concerns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      return await handleCreate(req, res)
    }

    if (req.method === 'GET') {
      return await handleList(req, res)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in feedback API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/feedback - Create new feedback
 */
async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate input
    const input = createFeedbackSchema.parse(req.body)

    // Delegate to controller
    const feedback = await feedbackController.createFeedback(input)

    return res.status(201).json(feedback)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      })
    }
    throw error
  }
}

/**
 * GET /api/feedback - List feedback with filters and pagination
 */
async function handleList(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate and parse query parameters
    const query = listFeedbackQuerySchema.parse(req.query)

    // Delegate to controller
    const result = await feedbackController.listFeedback(query)

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: error.errors,
      })
    }
    throw error
  }
}
