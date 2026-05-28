'use client'

import { Wrench, Zap, Link2 } from 'lucide-react'

export default function CanvasSection() {
  return (
    <section className="relative py-24 px-8 bg-[#0F172A]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white">The canvas is the product.</h2>
          <p className="text-slate-400 mt-2">
            Drag nodes, wire connections, watch your automation come alive.
          </p>
        </div>

        {/* Browser mockup */}
        <div className="rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1E293B] border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-slate-800 rounded-md px-3 py-1 text-xs text-slate-500 font-mono">
                app.flowforge.io/editor/support-triage
              </div>
            </div>
          </div>

          {/* Canvas screenshot — represented as a styled placeholder */}
          <div className="bg-[#F8FAFC] p-6">
            <div className="flex h-[320px] gap-0 rounded-xl overflow-hidden border border-slate-200">
              {/* Sidebar */}
              <div className="w-48 bg-white border-r border-slate-100 p-4 flex flex-col gap-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Add Nodes</div>
                {['Webhook', 'LLM', 'HTTP', 'Condition'].map((name) => (
                  <div key={name} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs text-slate-600 cursor-pointer hover:border-indigo-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    {name}
                  </div>
                ))}
              </div>
              {/* Canvas */}
              <div className="flex-1 bg-slate-50 relative">
                {/* Grid dots */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }} />
                {/* Fake nodes */}
                <div className="absolute top-16 left-16 px-4 py-2 bg-violet-100 border border-violet-300 rounded-lg text-xs font-medium text-violet-700">Webhook</div>
                <div className="absolute top-16 left-64 px-4 py-2 bg-violet-100 border border-violet-300 rounded-lg text-xs font-medium text-violet-700">LLM</div>
                <div className="absolute top-16 left-[260px] px-4 py-2 bg-amber-100 border border-amber-300 rounded-lg text-xs font-medium text-amber-700">Condition</div>
                <div className="absolute top-16 left-[360px] px-4 py-2 bg-cyan-100 border border-cyan-300 rounded-lg text-xs font-medium text-cyan-700">HTTP</div>
                {/* Edges */}
                <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
                  <path d="M 120 30 L 200 30" stroke="#7C3AED" strokeWidth="2" fill="none" />
                  <path d="M 280 30 L 350 30" stroke="#B45309" strokeWidth="2" fill="none" />
                  <path d="M 400 30 L 450 30" stroke="#0E7490" strokeWidth="2" fill="none" />
                </svg>
              </div>
              {/* Inspector */}
              <div className="w-56 bg-white border-l border-slate-100 p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">LLM Node</div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Model</label>
                    <div className="mt-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                      llama-3.3-70b-versatile
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">System prompt</label>
                    <div className="mt-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 h-12" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Prompt</label>
                    <div className="mt-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 h-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 feature callouts */}
        <div className="grid grid-cols-3 gap-6 mt-12 text-center">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-white font-semibold text-sm">Drag-and-drop editor</div>
            <div className="text-slate-400 text-xs mt-1">Snaps, zooms, pans — feels like Figma</div>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-white font-semibold text-sm">Run and observe</div>
            <div className="text-slate-400 text-xs mt-1">Watch nodes execute in real time</div>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
              <Link2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-white font-semibold text-sm">Webhook or manual</div>
            <div className="text-slate-400 text-xs mt-1">Live URL for every workflow</div>
          </div>
        </div>
      </div>
    </section>
  )
}
