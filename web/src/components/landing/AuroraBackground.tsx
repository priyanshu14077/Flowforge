'use client'

import { useEffect, useRef } from 'react'

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = [
      { r: 99, g: 102, b: 241 },   // indigo
      { r: 167, g: 139, b: 250 }, // violet
      { r: 34, g: 211, b: 238 },  // cyan
      { r: 245, g: 158, b: 11 },  // amber
    ]

    const blobs: { x: number; y: number; vx: number; vy: number; color: number; radius: number }[] = []
    for (let i = 0; i < 6; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: Math.floor(Math.random() * colors.length),
        radius: 300 + Math.random() * 400,
      })
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(7, 10, 18, 0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((blob) => {
        blob.x += blob.vx
        blob.y += blob.vy
        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius

        const c = colors[blob.color]
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)
        gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.15)`)
        gradient.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.05)`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}