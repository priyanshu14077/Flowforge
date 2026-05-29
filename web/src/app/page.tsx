import Hero from '@/components/landing/Hero'
import FeatureShowcase from '@/components/landing/FeatureShowcase'
import Templates from '@/components/landing/Templates'
import CanvasSection from '@/components/landing/CanvasSection'
import CTASection from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <FeatureShowcase />
      <Templates />
      <CanvasSection />
      <CTASection />
    </main>
  )
}