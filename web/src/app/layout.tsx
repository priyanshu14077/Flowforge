import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flowforge — AI Workflow Builder',
  description: 'Build AI automations with a visual canvas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}