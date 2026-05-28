'use client'

import { templates } from '@/lib/landingassets'
import TemplateCard from './TemplateCard'

export default function Templates() {
  return (
    <section className="relative py-24 px-8 bg-[#070A12]">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010a51f750?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-white">Start with proven automations</h2>
          <p className="text-slate-400 mt-2">
            Pick a template and have a working workflow in minutes.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {templates.map((template, i) => (
            <TemplateCard key={i} template={template} />
          ))}
        </div>
      </div>
    </section>
  )
}
