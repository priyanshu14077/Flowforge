'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// High-res free Unsplash images for each feature
const FEATURE_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=90',
    alt: 'AI neural network visualization',
    label: 'LLM-Powered',
    sublabel: 'Groq inference in 340ms',
    color: '#A78BFA',
    tag: 'Neural Networks',
  },
  {
    src: 'https://images.unsplash.com/photo-1558494949-ef010a51f750?w=800&q=90',
    alt: 'Global API network connections',
    label: 'HTTP Integration',
    sublabel: 'OAuth, Bearer, API Keys',
    color: '#22D3EE',
    tag: 'REST & GraphQL',
  },
  {
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=90',
    alt: 'Real-time webhook triggers',
    label: 'Instant Webhooks',
    sublabel: '<50ms trigger time',
    color: '#F59E0B',
    tag: 'Event-Driven',
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=90',
    alt: 'Real-time observability dashboard',
    label: 'Live Observability',
    sublabel: '100% execution tracing',
    color: '#10B981',
    tag: 'Debug & Monitor',
  },
]

function FeatureImage({ image, index }: { image: typeof FEATURE_IMAGES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!cardRef.current) return

    // Entry animation: slide up + fade in with stagger
    gsap.from(cardRef.current, {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 85%',
      },
    })

    // Parallax: image moves slower than card (depth effect)
    gsap.to(imgRef.current, {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    // Subtle scale-up on scroll into view
    gsap.fromTo(cardRef.current,
      { scale: 0.95 },
      {
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
        },
      }
    )
  })

  return (
    <div
      ref={cardRef}
      className="relative flex-shrink-0 w-[360px] h-[480px] rounded-3xl overflow-hidden group cursor-pointer"
      style={{ scrollSnapAlign: 'center' }}
    >
      {/* Image with parallax wrapper */}
      <div ref={imgRef} className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="360px"
          priority={index < 2}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Color accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${image.color}, transparent)` }}
      />

      {/* Tag pill */}
      <div className="absolute top-5 left-5">
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md"
          style={{
            background: `${image.color}20`,
            color: image.color,
            border: `1px solid ${image.color}40`,
          }}
        >
          {image.tag}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md"
          style={{ background: `${image.color}20`, border: `1px solid ${image.color}40` }}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: image.color }} />
        </div>

        <h3 className="text-2xl font-bold text-white">{image.label}</h3>
        <p className="text-slate-400 text-sm">{image.sublabel}</p>

        {/* Animated border line */}
        <div className="h-px w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ background: `linear-gradient(90deg, ${image.color}, transparent)` }} />
      </div>

      {/* Corner glow on hover */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: image.color }}
      />
    </div>
  )
}

export default function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Horizontal scroll effect
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.feature-card-scroll')
    if (cards.length === 0) return

    const totalScroll = container.scrollWidth - window.innerWidth + 200

    gsap.to(cards, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
  })

  return (
    <div
      ref={containerRef}
      className="relative h-screen flex items-center overflow-hidden bg-[#070A12]"
    >
      {/* Section label */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center">
        <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5">
          How Flowforge Works
        </span>
        <h2 className="text-5xl font-bold text-white mt-6 max-w-xl">
          Four pillars. Infinite possibilities.
        </h2>
      </div>

      {/* Scrollable feature cards */}
      <div className="flex items-center gap-6 pl-[15vw] pr-[15vw] feature-card-scroll">
        {FEATURE_IMAGES.map((image, i) => (
          <FeatureImage key={i} image={image} index={i} />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-slate-500 text-sm">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-slate-600" />
        <span>Scroll to explore</span>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-slate-600" />
      </div>

      {/* Side gradients for fade effect */}
      <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#070A12] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#070A12] to-transparent pointer-events-none z-10" />
    </div>
  )
}