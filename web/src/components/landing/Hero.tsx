'use client'

import dynamic from 'next/dynamic'
import { ChevronDown } from 'lucide-react'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-8 py-24 dot-grid">
      {/* Radial glow background */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <div>
          <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-6">
            AI Workflow Builder
          </p>
          <h1 className="text-6xl font-bold text-white leading-tight">
            Build automations<br />visually.
          </h1>
          <p className="text-slate-400 text-xl mt-4 leading-relaxed">
            Connect LLMs, APIs, webhooks, and logic<br />on one canvas.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a
              href="/login"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Start building
            </a>
            <a
              href="#demo"
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              View demo
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            No code required · Free to start
          </p>
        </div>

        {/* Right: Animated Canvas */}
        <div className="flex justify-center">
          <HeroCanvas />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-500">
        <span className="text-xs mb-2">See what's possible</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  )
}
