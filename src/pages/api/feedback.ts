import type { NextApiRequest, NextApiResponse } from 'next'
import { feedbackController } from '@/controllers/feedbackController'
import { ListFeedbackQuery } from '@/models/feedback'

// API routes for feedback operations
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return handleCreate(req, res)
  }

  if (req.method === 'GET') {
    return handleList(req, res)
  }

  res.status(405).json({ error: 'Method not allowed' })
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  const { text, email } = req.body

  // Basic validation
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string' })
  }

  try {
    const feedback = await feedbackController.createFeedback({ text, email })
    return res.status(201).json(feedback)
  } catch (error) {
    console.error('Error creating feedback:', error)
    return res.status(500).json({ error: 'Failed to create feedback' })
  }
}

async function handleList(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse query parameters
    const query: ListFeedbackQuery = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      priority: req.query.priority as any,
      sentiment: req.query.sentiment as any,
    }

    const result = await feedbackController.listFeedback(query)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Error listing feedback:', error)
    return res.status(500).json({ error: 'Failed to fetch feedback' })
  }
}
