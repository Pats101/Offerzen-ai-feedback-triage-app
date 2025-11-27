import React from 'react'

interface TagProps {
  label: string
}

// Modern SaaS-style tag chip with indigo color scheme
export const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
      {label}
    </span>
  )
}
