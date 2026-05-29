'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css'

// Font variables — defined as CSS custom properties on the root
const FONT_BRICOLAGE = "'Bricolage Grotesque', sans-serif"
const FONT_SYNE = "'Syne', sans-serif"
const FONT_DM_SANS = "'DM Sans', sans-serif"

const ACCENT_PRIMARY = '#6B6CF9'
const ACCENT_SECONDARY = '#3AC8A4'

const STATS = [
  { value: '340ms', label: 'Avg latency' },
  { value: '10k', label: 'Runs free/mo' },
  { value: '99.9%', label: 'Uptime SLA' },
]

interface HeroProps {
  backgroundImage?: string
  children?: React.ReactNode
}

export default function Hero({ backgroundImage, children }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const ctaRowRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const shapesRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reduced motion check
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    // Badge — fade and slide up
    if (badgeRef.current) {
      tl.fromTo(badgeRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
    }

    // Headline — fade and slide up
    if (headlineRef.current) {
      tl.fromTo(headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.4'
      )
    }

    // Subheading — slide up
    if (subheadingRef.current) {
      tl.fromTo(subheadingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.5'
      )
    }

    // CTA buttons — scale in with stagger
    if (ctaRowRef.current) {
      const ctas = ctaRowRef.current.querySelectorAll('a')
      tl.fromTo(ctaRowRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6 },
        '-=0.3'
      )
      if (ctas.length > 0) {
        tl.fromTo(ctas[0],
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
      }
      if (ctas.length > 1) {
        tl.fromTo(ctas[1],
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          '-=0.4'
        )
      }
    }

    // Stats strip — fade in
    if (statsRef.current) {
      tl.fromTo(statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      )

      // Counter tween for numeric stats
      const statValues = statsRef.current.querySelectorAll('[data-count]')
      statValues.forEach((el) => {
        const target = el.getAttribute('data-count')
        if (target) {
          const numericTarget = parseFloat(target)
          if (!isNaN(numericTarget)) {
            const obj = { val: 0 }
            tl.to(obj, {
              val: numericTarget,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = obj.val % 1 === 0 ? Math.round(obj.val).toString() : obj.val.toFixed(1)
              },
            }, '-=0.6')
          }
        }
      })
    }

    // Decorative shapes — draw in via strokeDashoffset
    if (shapesRef.current) {
      const shapes = shapesRef.current.querySelectorAll('[data-path]')
      shapes.forEach((shape) => {
        const pathEl = shape as SVGGeometryElement
        const length = pathEl.getTotalLength?.() || 100
        gsap.set(shape, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
        tl.to(shape, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
        }, 0.2)
      })
    }

    // Scroll parallax for background
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    // Scroll parallax for decorative shapes — different speeds
    if (shapesRef.current) {
      const shapes = shapesRef.current.querySelectorAll('[data-speed]')
      shapes.forEach((shape) => {
        const speed = parseFloat(shape.getAttribute('data-speed') || '0.15')
        gsap.to(shape, {
          y: `${speed * -150}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }

    // Remove will-change after animations complete
    tl.eventCallback('onComplete', () => {
      const animated = sectionRef.current?.querySelectorAll('[style*="will-change"]')
      animated?.forEach((el) => {
        ;(el as HTMLElement).style.willChange = 'auto'
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  // Magnetic hover on primary CTA
  useEffect(() => {
    const primaryBtn = document.querySelector('[data-magnetic]') as HTMLElement
    if (!primaryBtn) return

    const magneticArea = primaryBtn.closest('[data-magnetic-area]') as HTMLElement
    if (!magneticArea) return

    const quickX = gsap.quickTo(primaryBtn, 'x', { duration: 0.3, ease: 'power2.out' })
    const quickY = gsap.quickTo(primaryBtn, 'y', { duration: 0.3, ease: 'power2.out' })
    const radius = 100

    const handleMouseMove = (e: MouseEvent) => {
      const rect = magneticArea.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const dist = Math.sqrt(distX * distX + distY * distY)

      if (dist < radius) {
        const factor = 1 - dist / radius
        quickX(distX * factor * 0.06)
        quickY(distY * factor * 0.06)
      } else {
        quickX(0)
        quickY(0)
      }
    }

    const handleMouseLeave = () => {
      quickX(0)
      quickY(0)
    }

    magneticArea.addEventListener('mousemove', handleMouseMove)
    magneticArea.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      magneticArea.removeEventListener('mousemove', handleMouseMove)
      magneticArea.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Mouse-following subtle radial glow on overlay
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    let rafId: number
    let targetX = 0.5
    let targetY = 0.5
    let currentX = 0.5
    let currentY = 0.5

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth
      targetY = e.clientY / window.innerHeight
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.05
      currentY += (targetY - currentY) * 0.05
      overlay.style.background = `
        radial-gradient(
          600px circle at ${currentX * 100}% ${currentY * 100}%,
          rgba(107, 108, 249, 0.06) 0%,
          transparent 60%
        ),
        linear-gradient(
          135deg,
          rgba(7, 10, 18, 0.92) 0%,
          rgba(7, 10, 18, 0.70) 40%,
          rgba(7, 10, 18, 0.75) 100%
        )
      `
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-label="Hero"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className={styles.background}
        role="img"
        aria-label="Abstract dark topographic aerial view — fluid dynamics"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : 'url(https://images.unsplash.com/photo-1509909756405-be0194f68a3e?w=1920&q=85)',
          willChange: 'transform',
        }}
      />

      {/* Overlay with mouse-following glow */}
      <div ref={overlayRef} className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        {/* Eyebrow badge */}
        <span ref={badgeRef} className={styles.badge}>
          <span className={styles.badgeDot} />
          AI Workflow Builder
        </span>

        {/* Headline */}
        <h1 ref={headlineRef} className={styles.headline}>
          <span className={styles.headlineLine}>Build automations</span>
          <span className={styles.headlineLine}>
            <span className={styles.accentWord}>visually.</span>
          </span>
        </h1>

        {/* Subheading */}
        <p ref={subheadingRef} className={styles.subheading}>
          Connect LLMs, APIs, webhooks, and logic on one canvas.
          No code required. Ship in minutes, not months.
        </p>

        {/* CTA row */}
        <div ref={ctaRowRef} className={styles.ctaRow}>
          <div data-magnetic-area className={styles.ctaMagneticArea}>
            <a
              href="/login"
              className={styles.ctaPrimary}
              data-magnetic
              aria-label="Start building for free"
            >
              Start building — free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <a
            href="#features"
            className={styles.ctaSecondary}
            aria-label="See how it works"
          >
            See how it works
          </a>
        </div>

        {/* Stats strip */}
        <div ref={statsRef} className={styles.statsStrip}>
          {STATS.map((stat, i) => (
            <div key={i}>
              {i > 0 && <div className={styles.statDivider} aria-hidden="true" />}
              <div className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Optional floating canvas preview */}
        {children}
      </div>

      {/* Decorative SVG shapes */}
      <div ref={shapesRef} className={styles.decorativeShapes} aria-hidden="true">
        {/* Diamond */}
        <svg
          data-path
          data-speed="0.15"
          className={styles.shape + ' ' + styles.shapeDiamond}
          viewBox="0 0 60 60"
        >
          <rect x="15" y="15" width="30" height="30" />
        </svg>

        {/* Arc */}
        <svg
          data-path
          data-speed="0.25"
          className={styles.shape + ' ' + styles.shapeArc}
          viewBox="0 0 200 100"
        >
          <path d="M 10 80 Q 100 0 190 80" />
        </svg>

        {/* Grid fragment */}
        <svg
          data-path
          data-speed="0.15"
          className={styles.shape + ' ' + styles.shapeGrid}
          viewBox="0 0 80 80"
        >
          <line x1="0" y1="0" x2="80" y2="80" />
          <line x1="80" y1="0" x2="0" y2="80" />
          <line x1="40" y1="0" x2="40" y2="80" />
          <line x1="0" y1="40" x2="80" y2="40" />
        </svg>

        {/* Horizontal line */}
        <svg
          data-path
          data-speed="0.5"
          className={styles.shape + ' ' + styles.shapeLine}
          viewBox="0 0 120 1"
        >
          <line x1="0" y1="0.5" x2="120" y2="0.5" />
        </svg>
      </div>
    </section>
  )
}