import Hero from '@/components/landing/Hero'
import Templates from '@/components/landing/Templates'
import CanvasSection from '@/components/landing/CanvasSection'
import CTASection from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Templates />
      <CanvasSection />
      <CTASection />
    </main>
  )
}
