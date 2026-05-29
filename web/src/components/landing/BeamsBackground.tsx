'use client'

import { useEffect, useRef } from 'react'

interface Beam {
  x: number
  angle: number
  width: number
  opacity: number
  speed: number
  color: string
}

export default function BeamsBackground() {
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

    const beams: Beam[] = []
    const colors = ['rgba(99, 102, 241, 0.08)', 'rgba(167, 139, 250, 0.06)', 'rgba(34, 211, 238, 0.05)']

    for (let i = 0; i < 8; i++) {
      beams.push({
        x: Math.random() * canvas.width,
        angle: -30 - Math.random() * 20,
        width: 200 + Math.random() * 400,
        opacity: 0.3 + Math.random() * 0.4,
        speed: 0.2 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.005

      beams.forEach((beam, i) => {
        beam.x += beam.speed
        if (beam.x > canvas.width + 500) {
          beam.x = -500
          beam.opacity = 0.2 + Math.random() * 0.4
        }

        const waveOffset = Math.sin(time + i * 0.5) * 10
        const gradient = ctx.createLinearGradient(
          beam.x, 0,
          beam.x + waveOffset + beam.width * 0.3, canvas.height
        )
        gradient.addColorStop(0, 'rgba(0,0,0,0)')
        gradient.addColorStop(0.3, beam.color)
        gradient.addColorStop(0.6, beam.color.replace('0.08', '0.04').replace('0.06', '0.03').replace('0.05', '0.025'))
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.save()
        ctx.translate(beam.x, 0)
        ctx.rotate((beam.angle + waveOffset * 0.2) * Math.PI / 180)
        ctx.fillStyle = gradient
        ctx.fillRect(-beam.width / 2, -canvas.height, beam.width, canvas.height * 2)
        ctx.restore()
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
    />
  )
}