'use client'

import type { NodeType } from '@/lib/types'

interface NodeTemplate {
  type: NodeType
  label: string
  icon: string
  description: string
  defaultData: Record<string, unknown>
}

const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: 'llm',
    label: 'LLM',
    icon: '🤖',
    description: 'Groq-powered language model',
    defaultData: { model: 'llama-3.3-70b-versatile', prompt: '', systemPrompt: '' },
  },
  {
    type: 'http',
    label: 'HTTP',
    icon: '🌐',
    description: 'Make an HTTP request',
    defaultData: { method: 'GET', url: '', headers: {}, body: '' },
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: '🔀',
    description: 'Branch based on a condition',
    defaultData: { field: '', operator: 'equals', value: '' },
  },
]

interface NodePaletteProps {
  onAddNode: (type: NodeType, data: Record<string, unknown>) => void
}

export default function NodePalette({ onAddNode }: NodePaletteProps) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col gap-3">
      <h2 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-1">
        Add Nodes
      </h2>
      {NODE_TEMPLATES.map((template) => (
        <button
          key={template.type}
          onClick={() => onAddNode(template.type, template.defaultData)}
          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{template.icon}</span>
            <span className="font-medium text-slate-900 text-sm">{template.label}</span>
          </div>
          <p className="text-xs text-slate-500">{template.description}</p>
        </button>
      ))}
    </div>
  )
}
