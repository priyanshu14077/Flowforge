'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface NodeDef {
  id: string
  label: string
  type: 'webhook' | 'llm' | 'condition' | 'http'
  x: number
  y: number
  status: 'idle' | 'running' | 'done'
}

const NODES: NodeDef[] = [
  { id: 'wh', label: 'Webhook', type: 'webhook', x: 120, y: 80 },
  { id: 'llm', label: 'LLM', type: 'llm', x: 280, y: 160 },
  { id: 'cond', label: 'Condition', type: 'condition', x: 440, y: 80 },
  { id: 'http', label: 'HTTP', type: 'http', x: 600, y: 160 },
]

const EDGES = [
  { from: 'wh', to: 'llm' },
  { from: 'llm', to: 'cond' },
  { from: 'cond', to: 'http', handle: 'true' },
]

const NODE_COLORS = {
  webhook: { bg: '#1E293B', text: '#94A3B8', glow: '#475569' },
  llm: { bg: '#2E1065', text: '#A78BFA', glow: '#7C3AED' },
  condition: { bg: '#451a03', text: '#F59E0B', glow: '#B45309' },
  http: { bg: '#083344', text: '#22D3EE', glow: '#0E7490' },
}

const STATUS_LABELS: Record<string, string> = {
  webhook: 'Received',
  llm: 'Classifying...',
  condition: 'urgent: true',
  http: 'POST api.slack.com',
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = 760
    canvas.height = 280

    // Draw edges on canvas
    const ctx = canvas.getContext('2d')!
    const drawEdges = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      EDGES.forEach((edge) => {
        const from = NODES.find((n) => n.id === edge.from)!
        const to = NODES.find((n) => n.id === edge.to)!
        const fromColor = NODE_COLORS[from.type].glow
        const toColor = NODE_COLORS[to.type].glow

        ctx.beginPath()
        ctx.strokeStyle = toColor
        ctx.lineWidth = 2
        ctx.moveTo(from.x + 80, from.y + 30)
        ctx.bezierCurveTo(from.x + 80, from.y + 80, to.x - 80, to.y + 80, to.x - 80, to.y + 30)
        ctx.stroke()

        // Animated dot traveling along edge
        const dot = new Path2D()
        dot.addCircle?.(from.x + 80, from.y + 30)
      })

      // Pulsing dots animation
      EDGES.forEach((edge) => {
        const from = NODES.find((n) => n.id === edge.from)!
        const to = NODES.find((n) => n.id === edge.to)!
        const color = NODE_COLORS[to.type].glow

        ctx.save()
        ctx.shadowBlur = 8
        ctx.shadowColor = color
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(from.x + 80, from.y + 30, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    drawEdges()

    // GSAP timeline — 10 second loop
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 })
    tlRef.current = tl

    // Sequence
    NODES.forEach((node, i) => {
      const el = nodeRefs.current.get(node.id)
      if (!el) return

      // Node fires
      tl.to(el, {
        boxShadow: `0 0 24px ${NODE_COLORS[node.type].glow}`,
        borderColor: NODE_COLORS[node.type].glow,
        duration: 0.3,
        ease: 'power2.out',
      }, i * 2)

      // Checkmark appears
      const check = el.querySelector('.check-overlay') as HTMLElement
      if (check) {
        tl.to(check, { scale: 1, opacity: 1, duration: 0.2 }, i * 2 + 0.8)
      }

      // Reset
      if (i < NODES.length - 1) {
        tl.to(el, {
          boxShadow: 'none',
          duration: 0.2,
        }, i * 2 + 1.4)
      }
    })

    // Final reset after all nodes
    tl.to(Array.from(nodeRefs.current.values()), {
      boxShadow: 'none',
      borderColor: '#1E293B',
      duration: 0.3,
    }, 8)

    return () => { tl.kill() }
  }, [])

  return (
    <div className="relative w-[760px] h-[280px] bg-[#0F172A] rounded-2xl border border-slate-700 p-4 overflow-hidden">
      {/* Canvas for edge lines */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

      {/* SVG for edge connections */}
      <svg className="absolute inset-0 pointer-events-none" width={760} height={280}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bezier edges */}
        <path
          d="M 200 110 C 200 200, 360 200, 360 190"
          fill="none"
          stroke="#475569"
          strokeWidth="2"
          id="edge-wh-llm"
        />
        <path
          d="M 440 190 C 440 200, 600 200, 600 190"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2"
          id="edge-llm-cond"
        />
        <path
          d="M 520 110 C 520 200, 680 200, 680 190"
          fill="none"
          stroke="#B45309"
          strokeWidth="2"
          id="edge-cond-http"
        />
      </svg>

      {/* Nodes */}
      {NODES.map((node) => {
        const colors = NODE_COLORS[node.type]
        return (
          <div
            key={node.id}
            ref={(el) => { if (el) nodeRefs.current.set(node.id, el) }}
            className="absolute flex flex-col items-center justify-center w-[120px] h-[60px] rounded-xl border border-slate-700 transition-all duration-200"
            style={{ left: node.x, top: node.y, background: colors.bg, borderColor: colors.border }}
          >
            <span className="text-xs font-mono font-medium" style={{ color: colors.text }}>
              {node.label}
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: colors.text, opacity: 0.6 }}>
              {STATUS_LABELS[node.type]}
            </span>
            {/* Check overlay */}
            <div
              className="check-overlay absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 scale-0"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        )
      })}
    </div>
  )
}
