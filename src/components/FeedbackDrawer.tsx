import React, { useEffect, useState } from 'react'
import { Tag } from './Tag'
import { PriorityBadge } from './PriorityBadge'

interface Feedback {
  id: string
  text: string
  email: string | null
  createdAt: string
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  tags: string[]
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  nextAction: string
}

interface FeedbackDrawerProps {
  feedbackId: string
  isOpen: boolean
  onClose: () => void
}

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({ feedbackId, isOpen, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && feedbackId) {
      fetchFeedbackDetail()
    }
  }, [isOpen, feedbackId])

  const fetchFeedbackDetail = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Feedback not found')
        }
        throw new Error('Failed to fetch feedback details')
      }

      const data = await response.json()
      setFeedback(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50'
      case 'negative':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊'
      case 'negative':
        return '😞'
      default:
        return '😐'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white rounded-l-xl shadow-xl z-50 overflow-y-auto transform transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Feedback Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
                <p className="text-gray-600">Loading feedback details...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && feedback && (
            <div className="space-y-6">
              {/* Priority and Sentiment */}
              <div className="flex items-center gap-4">
                <PriorityBadge priority={feedback.priority} />
                <div className={`px-4 py-2 rounded-lg font-medium ${getSentimentColor(feedback.sentiment)}`}>
                  {getSentimentEmoji(feedback.sentiment)} {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                </div>
                <span className="text-sm text-gray-500 ml-auto">
                  {formatDate(feedback.createdAt)}
                </span>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Summary
                </h3>
                <p className="text-2xl font-semibold text-gray-900">{feedback.summary}</p>
              </div>

              {/* Full Feedback Text */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Full Feedback
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {feedback.text}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {feedback.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feedback.tags.map((tag, index) => (
                      <Tag key={index} label={tag} />
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>

                <div className="space-y-4">
                  {/* Priority Analysis */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Priority Level</h4>
                    <p className="text-blue-800">
                      {feedback.priority === 'P0' && 'Critical - Requires immediate attention'}
                      {feedback.priority === 'P1' && 'High - Should be addressed soon'}
                      {feedback.priority === 'P2' && 'Medium - Normal priority'}
                      {feedback.priority === 'P3' && 'Low - Can be addressed later'}
                    </p>
                  </div>

                  {/* Sentiment Analysis */}
                  <div className={`rounded-lg p-4 ${getSentimentColor(feedback.sentiment)}`}>
                    <h4 className="text-sm font-medium mb-1">Sentiment Analysis</h4>
                    <p>
                      {feedback.sentiment === 'positive' && 'Customer expressed satisfaction and positive feedback'}
                      {feedback.sentiment === 'neutral' && 'Customer provided objective or neutral feedback'}
                      {feedback.sentiment === 'negative' && 'Customer expressed concerns or dissatisfaction'}
                    </p>
                  </div>

                  {/* Next Action */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-1">Recommended Next Action</h4>
                    <p className="text-green-800">{feedback.nextAction}</p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <span className="text-lg">🆔</span>
                      Feedback ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono ml-7">{feedback.id}</dd>
                  </div>
                  {feedback.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <span className="text-lg">📧</span>
                        Contact Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 ml-7">
                        <a
                          href={`mailto:${feedback.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {feedback.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      Submitted
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 ml-7">{formatDate(feedback.createdAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Optional) */}
        {!loading && !error && feedback && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  )
}
