'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DiagnosticForm from './components/DiagnosticForm'

function DiagnosticContent() {
  const searchParams = useSearchParams()
  const zipCode = searchParams.get('zip') || ''
  const projectType = searchParams.get('project') || ''

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <DiagnosticForm initialZip={zipCode} initialProject={projectType} />
      </div>
    </main>
  )
}

export default function DiagnosticPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DiagnosticContent />
    </Suspense>
  )
}