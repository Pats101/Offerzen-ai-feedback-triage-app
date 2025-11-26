import type { NextApiRequest, NextApiResponse } from 'next'
import { feedbackController } from '@/controllers/feedbackController'

// API routes for feedback submission
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return handleCreate(req, res)
  }

  // TODO: add GET endpoint for listing feedback
  res.status(405).json({ error: 'Method not allowed' })
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const { content } = req.body

  // Basic validation
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content is required and must be a string' })
  }

  try {
    const feedback = await feedbackController.createFeedback({ content })
    return res.status(201).json(feedback)
  } catch (error) {
    console.error('Error creating feedback:', error)
    return res.status(500).json({ error: 'Failed to create feedback' })
  }
}
