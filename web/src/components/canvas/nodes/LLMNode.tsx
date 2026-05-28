'use client'

import { Handle, Position, NodeProps } from '@xyflow/react'
import type { LLMNodeData } from '@/lib/types'

export default function LLMNode({ data, selected }: NodeProps) {
  const d = data as unknown as LLMNodeData

  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[200px] ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>🤖</span>
        <span className="font-medium text-sm text-slate-700">LLM</span>
        <span className="text-xs text-slate-400 ml-auto font-mono">{d.model || 'no model'}</span>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2">{d.prompt || 'No prompt set'}</p>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}
