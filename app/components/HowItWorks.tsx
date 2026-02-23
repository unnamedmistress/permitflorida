import { Search, ClipboardCheck, FileCheck, Shield } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Enter Your Location',
    description: 'Type your Florida zip code to identify your specific jurisdiction. We cover all 67 counties and 400+ municipalities.',
  },
  {
    icon: ClipboardCheck,
    title: 'Describe Your Project',
    description: 'Select your project type and answer a few quick questions. We handle Florida-specific requirements like hurricane zones.',
  },
  {
    icon: FileCheck,
    title: 'Get Instant Results',
    description: 'Receive a clear YES, NO, or MAYBE answer with confidence level and specific reasoning for your jurisdiction.',
  },
  {
    icon: Shield,
    title: 'Take Action',
    description: 'If you need a permit, get detailed next steps, required forms, and optional contractor matching.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How PermitFlorida Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get clear permit answers in under 60 seconds. No more guessing, no more calling city offices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute top-0 left-12 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}