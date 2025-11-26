import React, { useState } from 'react'
import type { NextPage } from 'next'

// Basic feedback submission form
const SubmitFeedback: NextPage = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        alert('Feedback submitted!')
        setContent('')
      } else {
        alert('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Feedback</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Describe your issue, suggestion, or question..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubmitFeedback

// TODO: add better error/success messaging
// TODO: redirect to feedback list after submission?
