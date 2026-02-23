'use client'

import { useState } from 'react'
import { FileText, AlertCircle } from 'lucide-react'

interface JobDetailsProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export default function JobDetails({ value, onChange, maxLength = 2000 }: JobDetailsProps) {
  const [isFocused, setIsFocused] = useState(false)

  const charCount = value.length
  const isNearLimit = charCount > maxLength * 0.9

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Describe Your Project in Detail
        </label>
        <p className="text-sm text-gray-500">
          The more details you provide, the more accurate our permit assessment will be. 
          Include materials, dimensions, and any specific concerns.
        </p>
      </div>

      <div className={`relative ${isFocused ? 'ring-2 ring-blue-500 rounded-xl' : ''}`}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Example: I'm replacing 5 standard windows with impact-rated windows on the second floor of my home. The existing windows are 36x48 inches. This is in a coastal area (zip 33139). Work will involve removing old windows, installing new impact windows with proper anchoring, and finishing with trim. Total estimated value is $8,000-10,000. Looking to complete work before hurricane season starts..."
          rows={6}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-500">
          <span className={isNearLimit ? 'text-orange-600 font-medium' : ''}>
            {charCount}
          </span>
          {' / '}{maxLength} characters
        </p>
        
        {isNearLimit && (
          <div className="flex items-center gap-1 text-orange-600">
            <AlertCircle className="w-4 h-4" />
            <span>Approaching character limit</span>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium mb-2">Helpful details to include:</p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Approximate dimensions and square footage</li>
          <li>• Materials you plan to use</li>
          <li>• Whether it's a repair or replacement</li>
          <li>• Estimated total project value</li>
          <li>• Timeline or urgency</li>
          <li>• Any previous work done on this area</li>
        </ul>
      </div>
    </div>
  )
}