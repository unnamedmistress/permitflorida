'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Shield, MapPin, Hammer } from 'lucide-react'

const projectTypes = [
  { id: 'impact_windows', label: 'Impact Windows/Shutters', icon: '🪟' },
  { id: 'roof_repair', label: 'Roof Repair/Replacement', icon: '🏠' },
  { id: 'deck_patio', label: 'Deck/Patio', icon: '🌴' },
  { id: 'fence', label: 'Fence Installation', icon: '🚧' },
  { id: 'electrical', label: 'Electrical Work', icon: '⚡' },
  { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { id: 'hvac', label: 'HVAC Installation', icon: '❄️' },
  { id: 'interior_remodel', label: 'Interior Remodel', icon: '🏗️' },
  { id: 'addition', label: 'Room Addition', icon: '➕' },
  { id: 'demolition', label: 'Demolition', icon: '💥' },
]

export default function Hero() {
  const [zipCode, setZipCode] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStartCheck = () => {
    if (zipCode.length === 5 && selectedProject) {
      setIsLoading(true)
      router.push(`/diagnostic?zip=${zipCode}&project=${selectedProject}`)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <MapPin className="w-4 h-4 text-teal-300" />
            <span className="text-sm font-medium text-teal-100">Covering all 470 Florida jurisdictions</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Do You Need a Building Permit
            <span className="text-teal-300"> in Florida?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto">
            Get an instant answer for your Florida project. We cover all 67 counties and 400+ municipalities with hurricane and flood zone intelligence.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-300" />
              <span>Florida Building Code Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Hammer className="w-5 h-5 text-teal-300" />
              <span>Used by 10,000+ Floridians</span>
            </div>
          </div>

          {/* Diagnostic Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Zip Code Input */}
              <div>
                <label className="block text-left text-gray-700 font-semibold mb-2">
                  Enter your Florida zip code
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="33101"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg text-gray-900"
                  />
                </div>
              </div>

              {/* Project Type Selection */}
              <div>
                <label className="block text-left text-gray-700 font-semibold mb-3">
                  What type of project?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedProject(type.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedProject === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleStartCheck}
                disabled={zipCode.length !== 5 || !selectedProject || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin">⚡</span>
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {isLoading ? 'Checking...' : 'Check Permit Requirements'}
              </button>

              <p className="text-sm text-gray-500">
                Free lookup. 3 free checks per month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}