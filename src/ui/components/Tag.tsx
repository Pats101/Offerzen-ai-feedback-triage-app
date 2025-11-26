import React from 'react'

interface TagProps {
  label: string
}

export const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      {label}
    </span>
  )
}
