'use client'

import { Handle, Position, NodeProps } from '@xyflow/react'
import type { HTTPNodeData } from '@/lib/types'

const methodColors: Record<string, string> = {
  GET: 'text-green-600',
  POST: 'text-blue-600',
  PUT: 'text-yellow-600',
  DELETE: 'text-red-600',
}

export default function HTTPNode({ data, selected }: NodeProps) {
  const d = data as unknown as HTTPNodeData

  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[200px] ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>🌐</span>
        <span className={`font-mono text-xs font-bold ${methodColors[d.method] || 'text-slate-600'}`}>
          {d.method || 'GET'}
        </span>
      </div>
      <p className="text-xs text-slate-500 font-mono truncate">{d.url || 'No URL set'}</p>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}
