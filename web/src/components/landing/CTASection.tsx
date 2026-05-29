'use client'

import { ArrowRight, Play } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(contentRef.current?.children || [], {
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })
  })

  return (
    <section ref={sectionRef} className="relative py-40 px-6 bg-[#070A12] overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 800px 500px at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-indigo-500/10"
            style={{
              width: `${200 + i * 200}px`,
              height: `${200 + i * 200}px`,
              animation: `pulseRing ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div ref={contentRef} className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-6xl font-bold text-white leading-tight">
          Ready to forge your<br />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            first workflow?
          </span>
        </h2>

        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Join teams building AI automations without writing a single line of code.
          Ship faster. Scale infinitely. Sleep better.
        </p>

        <div className="flex items-center justify-center gap-5 pt-4">
          <a
            href="/login"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl text-lg overflow-hidden"
          >
            <span className="relative z-10">Start building — free</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
          <a
            href="#demo"
            className="group inline-flex items-center gap-3 px-10 py-5 border border-white/20 text-white font-medium rounded-2xl text-lg hover:bg-white/5 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
            </div>
            Watch 2-min demo
          </a>
        </div>

        <div className="flex items-center justify-center gap-8 pt-6">
          {[
            { icon: '⚡', label: 'No credit card required' },
            { icon: '🔥', label: '10k runs free per month' },
            { icon: '🚀', label: 'Deploy in 60 seconds' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-500 text-sm">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.05); }
        }
      `}</style>
    </section>
  )
}