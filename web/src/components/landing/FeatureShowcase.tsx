'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Zap, Globe, Webhook, Activity } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Abstract high-res images from Unsplash
const FEATURES = [
  {
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1400&q=90',
    icon: Zap,
    color: '#A78BFA',
    bgColor: 'rgba(167, 139, 250, 0.1)',
    label: 'LLM-Powered Intelligence',
    description: 'Groq-powered LLM nodes classify, route, and transform data with 340ms latency. No ML expertise — just connect and flow.',
    tag: 'Neural Processing',
    accent: '#7C3AED',
  },
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=90',
    icon: Globe,
    color: '#22D3EE',
    bgColor: 'rgba(34, 211, 238, 0.1)',
    label: 'Universal HTTP Integration',
    description: 'Connect any REST or GraphQL API. Interpolate {{context}} variables, handle OAuth, and transform responses in real time.',
    tag: 'API Connectivity',
    accent: '#0E7490',
  },
  {
    image: 'https://images.unsplash.com/photo-1557672172-298e0bd1b53d?w=1400&q=90',
    icon: Webhook,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    label: 'Instant Webhook Triggers',
    description: 'Every workflow gets a live webhook URL. Trigger from Slack, Stripe, GitHub, or any service in under 50ms.',
    tag: 'Event-Driven',
    accent: '#B45309',
  },
  {
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1400&q=90',
    icon: Activity,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    label: 'Real-time Observability',
    description: 'Watch every node execute step-by-step. See inputs, outputs, and errors as they happen. 100% execution tracing.',
    tag: 'Debug & Monitor',
    accent: '#047857',
  },
]

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!cardRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    // Image parallax — moves slower than card
    tl.from(imageWrapRef.current, {
      y: 60,
      duration: 1.2,
      ease: 'power3.out',
    }, 0)

    // Content slides in from right
    .from(contentRef.current, {
      x: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    }, 0.2)

    // Subtle scale on card
    .fromTo(cardRef.current,
      { scale: 0.97 },
      {
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0)

    // Scroll-driven parallax continue
    gsap.to(imageWrapRef.current, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
  })

  const Icon = feature.icon

  return (
    <div
      ref={cardRef}
      className="relative w-full h-[85vh] flex items-center overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Full-bleed background image */}
      <div ref={imageWrapRef} className="absolute inset-0">
        <Image
          src={feature.image}
          alt={feature.label}
          fill
          className="object-cover"
          sizes="100vw"
          priority={index === 0}
        />
      </div>

      {/* Gradient overlays — left dark for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070A12] 0%, from-[#070A12]/60% 40%, to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-2xl ml-[8vw] space-y-8">
        {/* Icon + tag */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md"
            style={{
              background: feature.bgColor,
              border: `1px solid ${feature.color}40`,
              boxShadow: `0 0 40px ${feature.color}20`,
            }}
          >
            <Icon className="w-8 h-8" style={{ color: feature.color }} />
          </div>
          <span
            className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full backdrop-blur-md"
            style={{
              background: `${feature.color}15`,
              color: feature.color,
              border: `1px solid ${feature.color}30`,
            }}
          >
            {feature.tag}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-6xl font-bold text-white leading-[1.1]">
          {feature.label.split(' ').map((word, i) => (
            <span
              key={i}
              className={i === feature.label.split(' ').length - 1 ? 'text-transparent' : 'text-white'}
              style={i === feature.label.split(' ').length - 1 ? {
                backgroundImage: `linear-gradient(135deg, ${feature.color}, ${FEATURES[(index + 1) % FEATURES.length].color})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              } : {}}
            >
              {word}{' '}
            </span>
          ))}
        </h2>

        {/* Description */}
        <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
          {feature.description}
        </p>

        {/* Metrics bar */}
        <div className="flex items-center gap-6 pt-4">
          <div
            className="px-6 py-3 rounded-2xl backdrop-blur-md"
            style={{
              background: `${feature.color}10`,
              border: `1px solid ${feature.color}25`,
            }}
          >
            <span className="text-2xl font-bold" style={{ color: feature.color }}>
              {index === 0 ? '340ms' : index === 1 ? 'OAuth 2.0' : index === 2 ? '<50ms' : '100%'}
            </span>
            <span className="text-slate-400 text-sm ml-2">
              {index === 0 ? 'avg latency' : index === 1 ? 'supported' : index === 2 ? 'trigger time' : 'trace coverage'}
            </span>
          </div>
        </div>

        {/* Decorative accent line */}
        <div
          className="h-1 w-32 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${feature.color}, transparent)`,
            boxShadow: `0 0 20px ${feature.color}50`,
          }}
        />
      </div>

      {/* Right side — abstract glow matching feature color */}
      <div
        className="absolute right-[10vw] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20"
        style={{ background: feature.color }}
      />

      {/* Node number */}
      <div className="absolute bottom-12 right-12">
        <span
          className="text-[120px] font-black leading-none select-none"
          style={{
            color: feature.color,
            opacity: 0.08,
            WebkitTextStroke: `1px ${feature.color}30`,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Section header animation
    gsap.from('.feature-header', {
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
    <section ref={sectionRef} className="relative bg-[#070A12]">
      {/* Section header */}
      <div className="feature-header text-center py-24 px-6 space-y-4">
        <span className="inline-block text-indigo-400 text-sm font-medium tracking-widest uppercase px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5">
          Core Capabilities
        </span>
        <h2 className="text-5xl font-bold text-white">
          Everything you need to build{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            AI automations
          </span>
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Four powerful primitives. Infinite combinations. Build any workflow in minutes.
        </p>
      </div>

      {/* Vertical scroll feature cards */}
      <div>
        {FEATURES.map((feature, i) => (
          <FeatureCard key={i} feature={feature} index={i} />
        ))}
      </div>
    </section>
  )
}