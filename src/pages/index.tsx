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
            An AI-powered feedback management system built to streamline customer feedback analysis and prioritization
          </p>
        </div>

        {/* Thank You Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Thank You for This Opportunity
              </h2>
              <p className="text-gray-700 leading-relaxed">
                I sincerely appreciate the opportunity to interview for this position. This application demonstrates my full-stack engineering skills, including Next.js, TypeScript, AI integration, database design, and modern UI/UX principles. I'm excited to discuss how I can contribute to your team.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        {/* <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">
              Automatic sentiment analysis, priority assignment, and tag generation using OpenAI
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Filtering</h3>
            <p className="text-sm text-gray-600">
              Filter by priority, sentiment, and tags with server-side pagination
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clean Architecture</h3>
            <p className="text-sm text-gray-600">
              Repository pattern, validators, mappers, and comprehensive error handling
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fully Tested</h3>
            <p className="text-sm text-gray-600">
              Comprehensive test coverage with Jest and React Testing Library
            </p>
          </div>
        </div> */}

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
