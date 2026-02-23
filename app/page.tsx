import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import FloridaMap from './components/FloridaMap'
import FAQ from './components/FAQ'
import CTASection from './components/CTASection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <FloridaMap />
      <Pricing />
      <FAQ />
      <CTASection />
    </main>
  )
}