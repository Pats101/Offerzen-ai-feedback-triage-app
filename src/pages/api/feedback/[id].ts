import type { NextApiRequest, NextApiResponse } from 'next'
import { feedbackController } from '@/controllers/feedbackController'
import { feedbackIdSchema } from '@/validators/feedbackValidator'
import { ZodError } from 'zod'

/**
 * API Route Handler for /api/feedback/:id
 * Handles operations on individual feedback items
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      return await handleGet(req, res)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in feedback/:id API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/feedback/:id - Get a single feedback by ID
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate ID parameter
    const { id } = feedbackIdSchema.parse(req.query)

    // Get feedback from controller
    const feedback = await feedbackController.getFeedbackById(id)

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' })
    }

    return res.status(200).json(feedback)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid feedback ID',
        details: error.errors,
      })
    }
    throw error
  }
}
