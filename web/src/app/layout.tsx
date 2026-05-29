import type { Metadata } from 'next'
import { Bricolage_Grotesque, Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Flowforge — Visual AI Workflow Builder',
  description: 'Build AI automations visually. Connect LLMs, APIs, webhooks, and logic on one canvas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1509909756405-be0194f68a3e?w=1920&q=85"
        />
      </head>
      <body className={`${bricolage.variable} ${syne.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
