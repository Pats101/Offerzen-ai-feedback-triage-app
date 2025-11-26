import OpenAI from 'openai'
import { config } from '@/lib/config'
import { retryWithBackoff } from './retry'
import { AIAnalysisResult } from '@/models/feedback'

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
})

// System prompt for feedback analysis
const ANALYSIS_PROMPT = `
You are an AI assistant that analyzes customer feedback.
Given a piece of feedback, extract:
1. Category (bug, feature, improvement, question, other)
2. Priority (low, medium, high, critical)
3. Relevant tags (array of keywords)

Respond with ONLY a valid JSON object in this exact format:
{
  "category": "bug|feature|improvement|question|other",
  "priority": "low|medium|high|critical",
  "tags": ["tag1", "tag2", "tag3"]
}

Do not include any explanations or additional text outside the JSON.
`

export async function analyzeFeedback(content: string): Promise<AIAnalysisResult> {
  try {
    const result = await retryWithBackoff(
      async () => {
        const response = await openai.chat.completions.create({
          model: config.openai.model,
          messages: [
            { role: 'system', content: ANALYSIS_PROMPT },
            { role: 'user', content: `Analyze this feedback: "${content}"` },
          ],
          temperature: 0.3,
          max_tokens: 500,
        })

        const messageContent = response.choices[0]?.message?.content
        if (!messageContent) {
          throw new Error('No response from OpenAI')
        }

        return JSON.parse(messageContent) as AIAnalysisResult
      },
      {
        maxRetries: config.openai.maxRetries,
        initialDelay: config.openai.retryDelay,
      }
    )

    return result
  } catch (error) {
    console.error('AI analysis failed, using defaults:', error)

    // Fallback to defaults if AI fails
    return {
      category: 'other',
      priority: 'medium',
      tags: [],
    }
  }
}
