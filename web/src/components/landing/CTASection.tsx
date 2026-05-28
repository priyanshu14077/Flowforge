'use client'

import { ArrowRight, Play } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative py-24 px-8 bg-[#070A12]">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to forge your first workflow?
        </h2>
        <p className="text-slate-400 mt-3">
          Join teams building AI automations without writing a single line of code.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Start building — free
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <Play className="w-4 h-4" />
            Watch 2-min demo
          </a>
        </div>

        <p className="text-slate-500 text-sm mt-4">
          No credit card required · 10k runs free per month
        </p>
      </div>
    </section>
  )
}
