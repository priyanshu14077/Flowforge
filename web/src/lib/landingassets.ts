// Free stock images from Unsplash (dark, tech, automation themed)
export const landingImages = {
  templateBg: 'https://images.unsplash.com/photo-1558494949-ef010a51f750?w=800&q=80', // network nodes dark
  heroGlow: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80', // abstract tech
}

// Template data for the Templates section
export interface TemplateItem {
  emoji: string
  name: string
  description: string
  nodes: { type: 'webhook' | 'llm' | 'http' | 'condition'; label: string }[]
  href: string
}

export const templates: TemplateItem[] = [
  {
    emoji: '🔧',
    name: 'Support Ticket Triage',
    description: 'Classify and route support tickets automatically',
    nodes: [
      { type: 'webhook', label: 'Webhook' },
      { type: 'llm', label: 'LLM' },
      { type: 'condition', label: 'Condition' },
      { type: 'http', label: 'HTTP' },
    ],
    href: '/editor/new?template=triage',
  },
  {
    emoji: '📇',
    name: 'Lead Enrichment',
    description: 'Enrich and validate new leads from forms',
    nodes: [
      { type: 'webhook', label: 'Form' },
      { type: 'llm', label: 'LLM' },
      { type: 'http', label: 'HTTP' },
      { type: 'http', label: 'Email' },
    ],
    href: '/editor/new?template=lead',
  },
  {
    emoji: '📝',
    name: 'AI Content Summarizer',
    description: 'Summarize articles and content via webhook',
    nodes: [
      { type: 'webhook', label: 'Webhook' },
      { type: 'llm', label: 'LLM' },
      { type: 'http', label: 'HTTP' },
    ],
    href: '/editor/new?template=summarize',
  },
  {
    emoji: '💬',
    name: 'Slack Notifier',
    description: 'Send AI-powered summaries to Slack on schedule',
    nodes: [
      { type: 'webhook', label: 'Schedule' },
      { type: 'llm', label: 'LLM' },
      { type: 'http', label: 'HTTP' },
    ],
    href: '/editor/new?template=slack',
  },
  {
    emoji: '📊',
    name: 'API Health Monitor',
    description: 'Monitor API endpoints and alert on failure',
    nodes: [
      { type: 'webhook', label: 'Schedule' },
      { type: 'http', label: 'HTTP' },
      { type: 'condition', label: 'Condition' },
      { type: 'http', label: 'Alert' },
    ],
    href: '/editor/new?template=monitor',
  },
  {
    emoji: '📋',
    name: 'Form Submission Router',
    description: 'Route and transform form submissions dynamically',
    nodes: [
      { type: 'webhook', label: 'Form' },
      { type: 'llm', label: 'LLM' },
      { type: 'condition', label: 'Condition' },
      { type: 'http', label: 'HTTP' },
    ],
    href: '/editor/new?template=router',
  },
]

// Node type to color mapping
export const nodeColors = {
  webhook: { bg: '#1E293B', text: '#94A3B8', border: '#334155' },
  llm: { bg: '#2E1065', text: '#A78BFA', border: '#7C3AED' },
  http: { bg: '#083344', text: '#22D3EE', border: '#0E7490' },
  condition: { bg: '#451a03', text: '#F59E0B', border: '#B45309' },
} as const
