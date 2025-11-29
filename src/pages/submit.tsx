import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { NavButton } from '@/components/NavButton'
import { useToast } from '@/contexts/ToastContext'
import { getApiUrl } from '@/lib/api-config'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Basic feedback submission form
const SubmitFeedback: NextPage = () => {
  const [text, setText] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const startTime = Date.now()

    try {
      const response = await fetch(getApiUrl('/api/feedback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, email: email || undefined }),
      })

      if (response.ok) {
        showToast('Feedback submitted successfully!', 'success')
        setText('')
        setEmail('')
      } else {
        showToast('Failed to submit feedback. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      // Ensure loading state is visible for at least 1 second
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 1000 - elapsedTime)

      setTimeout(() => {
        setLoading(false)
      }, remainingTime)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Feedback</h1>
          <div className="flex items-center gap-3">
            <NavButton
              href="/"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Home
            </NavButton>
            <NavButton
              href="/list"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            >
              View All Feedback
            </NavButton>
          </div>
        </div>

        {pageLoading ? (
          <div className="bg-white shadow rounded-lg p-6">
            <LoadingSpinner text="Loading form..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe your issue, suggestion, or question..."
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              )}
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default SubmitFeedback

// TODO: add better error/success messaging
// TODO: redirect to feedback list after submission?
