'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, FileText, Phone, Shield, Loader2, MapPin, DollarSign, Clock, ListChecks, ImageIcon } from 'lucide-react'
import ImageUpload from './ImageUpload'
import JobDetails from './JobDetails'

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
  fence: [
    { id: 'height', question: 'Fence height?', options: [{value: 'under6', label: 'Under 6 feet'}, {value: '6plus', label: '6+ feet'}, {value: 'pool', label: 'Pool fence'}] },
    { id: 'material', question: 'Fence material?', options: [{value: 'wood', label: 'Wood'}, {value: 'vinyl', label: 'Vinyl'}, {value: 'metal', label: 'Metal/Aluminum'}, {value: 'chain', label: 'Chain link'}] },
  ],
  electrical: [
    { id: 'scope', question: 'Type of electrical work?', options: [{value: 'outlet', label: 'Add/move outlet'}, {value: 'lighting', label: 'Lighting fixture'}, {value: 'panel', label: 'Panel upgrade'}, {value: 'circuit', label: 'New circuit'}] },
    { id: 'diy', question: 'Who will do the work?', options: [{value: 'electrician', label: 'Licensed electrician'}, {value: 'diy', label: 'DIY homeowner'}, {value: 'handyman', label: 'Handyman'}] },
  ],
  plumbing: [
    { id: 'scope', question: 'Type of plumbing work?', options: [{value: 'fixture', label: 'Replace fixture'}, {value: 'pipe', label: 'Pipe repair/replace'}, {value: 'waterheater', label: 'Water heater'}, {value: 'sewer', label: 'Sewer line'}] },
  ],
  hvac: [
    { id: 'type', question: 'HVAC work type?', options: [{value: 'replace', label: 'Replace existing unit'}, {value: 'new', label: 'New installation'}, {value: 'duct', label: 'Ductwork modification'}, {value: 'repair', label: 'Repair only'}] },
  ],
  interior_remodel: [
    { id: 'scope', question: 'Remodel scope?', options: [{value: 'cosmetic', label: 'Cosmetic only (paint, floors)'}, {value: 'walls', label: 'Moving/removing walls'}, {value: 'plumbing', label: 'Includes plumbing changes'}, {value: 'electrical', label: 'Includes electrical changes'}] },
    { id: 'value', question: 'Project value?', options: [{value: 'under5k', label: 'Under $5,000'}, {value: '5k-25k', label: '$5,000 - $25,000'}, {value: 'over25k', label: 'Over $25,000'}] },
  ],
  addition: [
    { id: 'size', question: 'Addition size?', options: [{value: 'small', label: 'Under 200 sq ft'}, {value: 'medium', label: '200-500 sq ft'}, {value: 'large', label: 'Over 500 sq ft'}] },
    { id: 'stories', question: 'Stories?', options: [{value: 'single', label: 'Single story'}, {value: 'multi', label: 'Multi-story'}] },
  ],
  demolition: [
    { id: 'structure', question: 'What are you demolishing?', options: [{value: 'interior', label: 'Interior only'}, {value: 'addition', label: 'Addition/structure'}, {value: 'whole', label: 'Whole building'}] },
  ],
  default: [
    { id: 'scope', question: 'What is the scope of work?', options: [{value: 'minor', label: 'Minor repair/cosmetic'}, {value: 'major', label: 'Major alteration'}, {value: 'structural', label: 'Structural change'}] },
    { id: 'value', question: 'Estimated project value?', options: [{value: 'under1k', label: 'Under $1,000'}, {value: '1k-5k', label: '$1,000 - $5,000'}, {value: '5k-25k', label: '$5,000 - $25,000'}, {value: 'over25k', label: 'Over $25,000'}] },
    { id: 'diy', question: 'Who will do the work?', options: [{value: 'diy', label: 'DIY (homeowner)'}, {value: 'contractor', label: 'Licensed contractor'}, {value: 'handyman', label: 'Handyman/unlicensed'}] },
  ],
}

interface DiagnosticResult {
  id: string
  status: 'yes' | 'no' | 'maybe'
  confidence: number
  reason: string
  jurisdiction: {
    county: string
    city?: string
    zipCode: string
  }
  projectType: string
  jobDetails?: string
  images: string[]
  nextSteps?: string[]
  estimatedTimeline?: string
  estimatedCost?: {
    min: number
    max: number
    unit: string
  }
}

export default function DiagnosticForm({ initialZip, initialProject }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [jobDetails, setJobDetails] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(false)

  const projectQuestions = questions[initialProject] || questions.default
  const currentQuestion = projectQuestions[currentStep]

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (currentStep < projectQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Show job details step after all questions
      setShowJobDetails(true)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode: initialZip,
          projectType: initialProject,
          answers,
          jobDetails,
          images: uploadedImages,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data.diagnostic)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Diagnostic failed:', error)
      alert('Failed to process diagnostic. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getProjectLabel = (type: string) => {
    const labels: Record<string, string> = {
      impact_windows: 'Impact Windows/Shutters',
      roof_repair: 'Roof Repair/Replacement',
      deck_patio: 'Deck/Patio',
      fence: 'Fence Installation',
      electrical: 'Electrical Work',
      plumbing: 'Plumbing',
      hvac: 'HVAC Installation',
      interior_remodel: 'Interior Remodel',
      addition: 'Room Addition',
      demolition: 'Demolition',
    }
    return labels[type] || type.replace('_', ' ')
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
              <p className="text-gray-600 max-w-lg mx-auto">{result.reason}</p>
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
              <p className="text-gray-600 max-w-lg mx-auto">{result.reason}</p>
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
              <p className="text-gray-600 max-w-lg mx-auto">{result.reason}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                Confidence: {result.confidence}%
              </div>
            </>
          )}
        </div>

        {/* Project Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Project Summary
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Location:</span>
              <p className="font-medium">{result.jurisdiction.county} ({result.jurisdiction.zipCode})</p>
            </div>
            <div>
              <span className="text-gray-500">Project Type:</span>
              <p className="font-medium">{getProjectLabel(result.projectType)}</p>
            </div>
            {result.estimatedTimeline && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Timeline:</span>
                <span className="font-medium">{result.estimatedTimeline}</span>
              </div>
            )}
            {result.estimatedCost && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Est. Permit Fee:</span>
                <span className="font-medium">${result.estimatedCost.min} - ${result.estimatedCost.max}</span>
              </div>
            )}
          </div>
          
          {/* Job Details Summary */}
          {result.jobDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-gray-500 text-sm">Job Details:</span>
              <p className="text-gray-700 mt-1 text-sm line-clamp-4">{result.jobDetails}</p>
            </div>
          )}
          
          {/* Uploaded Images Summary */}
          {result.images.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-gray-500 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Uploaded Images: {result.images.length}
              </span>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {result.images.slice(0, 6).map((url, idx) => (
                  <img key={idx} src={url} alt={`Project ${idx + 1}`} className="w-full aspect-square object-cover rounded" />
                ))}
                {result.images.length > 6 && (
                  <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                    +{result.images.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {result.status === 'yes' && result.nextSteps && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <ListChecks className="w-5 h-5" />
                Next Steps
              </h3>
              <ol className="space-y-2 text-blue-800">
                {result.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-medium">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {result.status !== 'no' && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                Upgrade to Pro for detailed permit requirements, all necessary forms, and our contractor matching service.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Upgrade to Pro - $19/month
              </button>
            </div>
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

  if (showJobDetails) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => showJobDetails ? setShowJobDetails(false) : router.push('/')} 
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-sm text-gray-500">Final Step</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '100%' }} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details & Photos</h2>
        
        <div className="space-y-8">
          {/* Job Details */}
          <JobDetails 
            value={jobDetails} 
            onChange={setJobDetails}
            maxLength={2000}
          />
          
          {/* Image Upload */}
          <ImageUpload 
            onUploadComplete={setUploadedImages}
            maxFiles={10}
          />
          
          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Project...
                </>
              ) : (
                <>
                  Get Permit Assessment
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Using {uploadedImages.length} images and {jobDetails.length} characters of details for analysis
            </p>
          </div>
        </div>

        {/* Location Badge */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            <MapPin className="w-4 h-4 inline mr-1" />
            <strong>Location:</strong> {initialZip}
          </p>
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

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.question}</h2>
      <p className="text-gray-500 mb-6">{getProjectLabel(initialProject)}</p>

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
          <MapPin className="w-4 h-4 inline mr-1" />
          <strong>Location:</strong> Zip code {initialZip}
        </p>
      </div>
    </div>
  )
}