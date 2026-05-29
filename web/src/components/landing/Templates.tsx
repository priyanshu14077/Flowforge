'use client'

import { templates } from '@/lib/landingassets'
import TemplateCard from './TemplateCard'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function Templates() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Staggered entrance animation
    gsap.from(titleRef.current?.children || [], {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  })

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-[#070A12]">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-16 space-y-4">
          <span className="inline-block text-indigo-400 text-sm font-medium tracking-widest uppercase px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5">
            Templates
          </span>
          <h2 className="text-5xl font-bold text-white">
            Start with proven automations
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Pick a template and have a working workflow in minutes. No setup required.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {templates.map((template, i) => (
            <div
              key={i}
              className="group"
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            >
              <TemplateCard template={template} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-500 mb-4">New templates added every week</p>
          <a
            href="/templates"
            className="inline-flex items-center gap-2 text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Browse all templates
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}