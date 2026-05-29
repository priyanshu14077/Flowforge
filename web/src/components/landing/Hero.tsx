'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const AuroraBackground = dynamic(() => import('./AuroraBackground'), { ssr: false })
const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })
const BeamsBackground = dynamic(() => import('./BeamsBackground'), { ssr: false })

// Node positions for the workflow canvas
const NODES = [
  { id: 'wh', label: 'Webhook', type: 'webhook', x: 80, y: 100, color: '#475569', bg: '#1E293B' },
  { id: 'llm', label: 'LLM', type: 'llm', x: 240, y: 180, color: '#A78BFA', bg: '#2E1065' },
  { id: 'cond', label: 'Condition', type: 'condition', x: 400, y: 100, color: '#F59E0B', bg: '#451a03' },
  { id: 'http', label: 'HTTP', type: 'http', x: 560, y: 180, color: '#22D3EE', bg: '#083344' },
]

const STATUS_LABELS: Record<string, string> = {
  webhook: 'Received',
  llm: 'Classifying...',
  condition: 'urgent: true',
  http: 'POST api.slack.com',
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const sublineRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useGSAP(() => {
    const tl = gsap.timeline()

    // Entrance animation
    tl.from(headlineRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
    .from(sublineRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6')
    .from(ctasRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.4')

    // Scroll-driven canvas animation
    const canvasTl = gsap.timeline()

    // Node firing sequence - 2s each
    NODES.forEach((node, i) => {
      const el = nodeRefs.current.get(node.id)
      if (!el) return

      canvasTl.to(el, {
        scale: 1.05,
        boxShadow: `0 0 30px ${node.color}`,
        borderColor: node.color,
        duration: 0.4,
        ease: 'power2.out',
      }, i * 2)
      .to(el.querySelector('.node-status'), {
        opacity: 1,
        duration: 0.2,
      }, i * 2)
      .to(el.querySelector('.check-overlay'), {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(2)',
      }, i * 2 + 0.6)
      .to(el, {
        scale: 1,
        boxShadow: 'none',
        borderColor: '#1E293B',
        duration: 0.3,
      }, i * 2 + 1.4)
    })

    // 10s loop
    canvasTl.repeat(-1)

    // Parallax on scroll
    gsap.to(canvasRef.current, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    gsap.to(headlineRef.current, {
      y: -40,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'center top',
        scrub: 1,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  })

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Layered animated backgrounds */}
      <AuroraBackground />
      <ParticleField />
      <BeamsBackground />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid pointer-events-none z-10" />

      {/* Radial glow */}
      <div className="absolute inset-0 radial-glow pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 grid grid-cols-2 gap-16 items-center min-h-screen">
        {/* Left: Copy */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase">
              AI Workflow Builder
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            Build automations<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              visually.
            </span>
          </h1>

          <p
            ref={sublineRef}
            className="text-xl text-slate-400 leading-relaxed max-w-lg"
          >
            Connect LLMs, APIs, webhooks, and logic on one canvas.
            No code. No compromise. Just flow.
          </p>

          <div ref={ctasRef} className="flex items-center gap-4">
            <a
              href="/login"
              className="group relative px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl overflow-hidden"
            >
              <span className="relative z-10">Start building — free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#canvas-section"
              className="px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              See how it works
            </a>
          </div>

          <div className="flex items-center gap-6 pt-4">
            {['No code required', 'Free to start', '10k runs/mo free'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-500 text-sm">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Animated workflow canvas */}
        <div ref={canvasRef} className="relative">
          <div className="relative w-full h-[380px] bg-[#0F172A]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 overflow-hidden">
            {/* Glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

            {/* Header bar */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-black/30 rounded-lg px-4 py-1.5 text-xs text-slate-400 font-mono text-center">
                  Support Ticket Triage — Live Demo
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Running</span>
              </div>
            </div>

            {/* SVG edges */}
            <svg className="absolute inset-0 pointer-events-none z-0" width="100%" height="100%">
              <defs>
                <filter id="glow-edge">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Edge: Webhook → LLM */}
              <path
                d="M 160 140 C 160 240, 320 240, 320 220"
                fill="none"
                stroke="url(#grad-violet)"
                strokeWidth="2"
                filter="url(#glow-edge)"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
                <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>

              {/* Edge: LLM → Condition */}
              <path
                d="M 320 220 C 320 240, 480 240, 480 140"
                fill="none"
                stroke="url(#grad-amber)"
                strokeWidth="2"
                filter="url(#glow-edge)"
                className="animate-pulse"
              />

              {/* Edge: Condition → HTTP */}
              <path
                d="M 480 140 C 480 240, 640 240, 640 220"
                fill="none"
                stroke="url(#grad-cyan)"
                strokeWidth="2"
                filter="url(#glow-edge)"
                className="animate-pulse"
              />

              {/* Animated dots traveling along edges */}
              <circle r="4" fill="#A78BFA" filter="url(#glow-edge)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 160 140 C 160 240, 320 240, 320 220" />
              </circle>
              <circle r="4" fill="#F59E0B" filter="url(#glow-edge)">
                <animateMotion dur="2s" begin="0.6s" repeatCount="indefinite" path="M 320 220 C 320 240, 480 240, 480 140" />
              </circle>
              <circle r="4" fill="#22D3EE" filter="url(#glow-edge)">
                <animateMotion dur="2s" begin="1.2s" repeatCount="indefinite" path="M 480 140 C 480 240, 640 240, 640 220" />
              </circle>
            </svg>

            {/* Nodes */}
            {NODES.map((node) => (
              <div
                key={node.id}
                ref={(el) => { if (el) nodeRefs.current.set(node.id, el) }}
                className="absolute flex flex-col items-center justify-center w-[130px] h-[70px] rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                style={{ left: node.x, top: node.y, background: node.bg }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: node.color + '30', color: node.color }}
                  >
                    {node.type.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white">{node.label}</span>
                </div>
                <span
                  className="node-status text-[10px] opacity-0 transition-opacity"
                  style={{ color: node.color }}
                >
                  {STATUS_LABELS[node.type]}
                </span>
                {/* Check overlay */}
                <div className="check-overlay absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center scale-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            ))}

            {/* Bottom stats */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-500">Nodes: <span className="text-white font-medium">4</span></span>
                <span className="text-slate-500">Runs: <span className="text-white font-medium">12.4k</span></span>
                <span className="text-slate-500">Avg: <span className="text-emerald-400 font-medium">340ms</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-slate-500 text-xs tracking-widest uppercase">Scroll to explore</span>
        <ChevronDown className="w-5 h-5 text-slate-400 animate-bounce" />
      </div>
    </section>
  )
}