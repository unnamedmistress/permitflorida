'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, FileText, Phone, Shield } from 'lucide-react'

interface Props {
  initialZip: string
  initialProject: string
}

const questions: Record<string, Array<{id: string, question: string, options: Array<{value: string, label: string}>}>> = {
  impact_windows: [
    { id: 'num_windows', question: 'How many windows are you replacing?', options: [{value: '1', label: '1 window'}, {value: '2-5', label: '2-5 windows'}, {value: '6+', label: '6+ windows'}] },
    { id: 'wind_zone', question: 'Is your property within 1 mile of the coast?', options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}, {value: 'unknown', label: 'Not sure'}] },
    { id: 'hoa', question: 'Is your property in an HOA?', options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}] },
  ],
  roof_repair: [
    { id: 'repair_type', question: 'What type of roof work?', options: [{value: 'repair', label: 'Repair (<25% of roof)'}, {value: 'replace', label: 'Full Replacement'}, {value: 'coat', label: 'Roof Coating'}] },
    { id: 'square_footage', question: 'Approximate roof square footage?', options: [{value: 'small', label: 'Under 1,000 sq ft'}, {value: 'medium', label: '1,000-2,500 sq ft'}, {value: 'large', label: 'Over 2,500 sq ft'}] },
  ],
  deck_patio: [
    { id: 'height', question: 'Will the deck be elevated?', options: [{value: 'ground', label: 'Ground level'}, {value: 'elevated', label: 'Elevated (>30 inches)'}, {value: 'attached', label: 'Attached to house'}] },
    { id: 'size', question: 'Approximate size?', options: [{value: 'small', label: 'Under 200 sq ft'}, {value: 'medium', label: '200-500 sq ft'}, {value: 'large', label: 'Over 500 sq ft'}] },
  ],
  default: [
    { id: 'scope', question: 'What is the scope of work?', options: [{value: 'minor', label: 'Minor repair/cosmetic'}, {value: 'major', label: 'Major alteration'}, {value: 'structural', label: 'Structural change'}] },
    { id: 'value', question: 'Estimated project value?', options: [{value: 'under1k', label: 'Under $1,000'}, {value: '1k-5k', label: '$1,000 - $5,000'}, {value: '5k-25k', label: '$5,000 - $25,000'}, {value: 'over25k', label: 'Over $25,000'}] },
    { id: 'diy', question: 'Who will do the work?', options: [{value: 'diy', label: 'DIY (homeowner)'}, {value: 'contractor', label: 'Licensed contractor'}, {value: 'handyman', label: 'Handyman/unlicensed'}] },
  ],
}

export default function DiagnosticForm({ initialZip, initialProject }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState<null | { status: 'yes' | 'no' | 'maybe', confidence: number, reason: string }>(null)

  const projectQuestions = questions[initialProject] || questions.default
  const currentQuestion = projectQuestions[currentStep]

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (currentStep < projectQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  const calculateResult = (finalAnswers: Record<string, string>) => {
    // Simplified logic - in production this would query a database
    const hasStructural = finalAnswers.scope === 'structural' || finalAnswers.repair_type === 'replace'
    const isHighValue = finalAnswers.value === '5k-25k' || finalAnswers.value === 'over25k'
    const isElevated = finalAnswers.height === 'elevated' || finalAnswers.height === 'attached'

    if (hasStructural || isHighValue || isElevated) {
      setResult({ status: 'yes', confidence: 85, reason: 'Structural work and/or high value projects require permits in Florida.' })
    } else if (finalAnswers.scope === 'minor' || finalAnswers.repair_type === 'repair') {
      setResult({ status: 'no', confidence: 70, reason: 'Minor repairs typically do not require permits in most Florida jurisdictions.' })
    } else {
      setResult({ status: 'maybe', confidence: 50, reason: 'Requirements vary by municipality. We recommend contacting your local building department.' })
    }
  }

  const getCountyFromZip = (zip: string) => {
    const countyMap: Record<string, string> = {
      '331': 'Miami-Dade', '330': 'Broward', '334': 'Palm Beach', '328': 'Orange',
      '336': 'Hillsborough', '322': 'Duval', '339': 'Lee', '341': 'Collier',
    }
    const prefix = zip.slice(0, 3)
    return countyMap[prefix] || 'Your County'
  }

  if (result) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          {result.status === 'yes' && (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Yes, You Need a Permit</h2>
              <p className="text-gray-600">{result.reason}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                Confidence: {result.confidence}%
              </div>
            </>
          )}
          {result.status === 'no' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">No Permit Required</h2>
              <p className="text-gray-600">{result.reason}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Confidence: {result.confidence}%
              </div>
            </>
          )}
          {result.status === 'maybe' && (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">It Depends</h2>
              <p className="text-gray-600">{result.reason}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                Confidence: {result.confidence}%
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          {result.status === 'yes' && (
            <>
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Next Steps for {getCountyFromZip(initialZip)}
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Contact {getCountyFromZip(initialZip)} Building Department</li>
                  <li>• Submit permit application with project plans</li>
                  <li>• Schedule inspections as required</li>
                  <li>• Typical timeline: 2-4 weeks for approval</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-4">Upgrade to Pro for detailed permit requirements, forms, and contractor matching.</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                  Upgrade to Pro - $19/month
                </button>
              </div>
            </>
          )}

          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Start New Check
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-sm text-gray-500">
            Question {currentStep + 1} of {projectQuestions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / projectQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h2>

      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <span className="font-medium text-gray-900">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Location:</strong> Zip code {initialZip} • {getCountyFromZip(initialZip)}
        </p>
      </div>
    </div>
  )
}