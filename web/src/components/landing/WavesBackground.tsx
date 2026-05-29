'use client'

import { useEffect, useRef } from 'react'

interface Wave {
  amplitude: number
  frequency: number
  speed: number
  phase: number
  y: number
  color: string
}

export default function WavesBackground() {
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

    const waves: Wave[] = [
      { amplitude: 50, frequency: 0.008, speed: 0.02, phase: 0, y: 0.3, color: 'rgba(99, 102, 241, 0.08)' },
      { amplitude: 40, frequency: 0.006, speed: 0.015, phase: 1, y: 0.5, color: 'rgba(167, 139, 250, 0.06)' },
      { amplitude: 30, frequency: 0.01, speed: 0.025, phase: 2, y: 0.7, color: 'rgba(34, 211, 238, 0.05)' },
    ]

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        const yPos = canvas.height * wave.y
        time += wave.speed

        ctx.beginPath()
        ctx.moveTo(0, yPos)

        for (let x = 0; x < canvas.width; x++) {
          const y = yPos + Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        ctx.fillStyle = wave.color
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
    />
  )
}