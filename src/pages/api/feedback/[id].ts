import type { NextApiRequest, NextApiResponse } from 'next'
import { feedbackController } from '@/controllers/feedbackController'

// Individual feedback operations - will implement as needed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: implement GET, PATCH, DELETE endpoints
  res.status(501).json({ error: 'Not implemented yet' })
}
