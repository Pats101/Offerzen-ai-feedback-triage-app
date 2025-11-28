import React from 'react'
import type { NextPage } from 'next'
import { NavButton } from '@/components/NavButton'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Feedback Triage
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered feedback analysis & prioritization
          </p>
        </div>

        {/* Thank You Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200 text-center">
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-4">
              ⭐⭐⭐⭐⭐
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Get Ready To Review My Assessment!
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              I had a great time building this, and I promise no AI agents were harmed in the making of this app 😄
              {/* <br /><br /> */}
              I did my best to keep the bugs to a minimum... but if you find any, don&apos;t worry, I consider them &quot;undocumented features&quot;. 🐛✨
              Thank you again for the opportunity, and enjoy! 🚀
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Assessment Complete!
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Submit feedback to see the AI analysis in action, or browse existing feedback to explore the filtering and detail features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavButton
              href="/submit"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Submit Feedback
            </NavButton>
            <Link
              href="/list"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-white rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Feedback
            </Link>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-3">Built with</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              Next.js 14
            </span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              TypeScript
            </span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              Prisma
            </span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              OpenAI
            </span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              Tailwind CSS
            </span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
              Jest
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
