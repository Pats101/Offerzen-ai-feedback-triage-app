import React from 'react'
import type { NextPage } from 'next'

// Placeholder for feedback list page
const FeedbackList: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feedback List</h1>
        <p>Coming soon...</p>
      </div>
    </div>
  )
}

export default FeedbackList

// TODO: fetch and display feedback list from API
// TODO: add filtering by status, priority
// TODO: add pagination
