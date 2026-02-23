import { ArrowRight, Shield } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-600 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
          <Shield className="w-4 h-4 text-teal-300" />
          <span className="text-sm font-medium">Join 10,000+ Florida homeowners</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Stop Guessing About Permits?
        </h2>

        <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
          Get clear, instant answers for your Florida building permit questions. 
          Start with 3 free checks per month.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/#"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Check Your Project Free
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 bg-blue-800/50 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-800/70 transition-colors backdrop-blur-sm"
          >
            View Pricing
          </a>
        </div>

        <p className="mt-8 text-sm text-teal-200">
          No credit card required for free tier. Cancel anytime.
        </p>
      </div>
    </section>
  )
}