'use client'

import { Handle, Position, NodeProps } from '@xyflow/react'
import type { ConditionNodeData } from '@/lib/types'

export default function ConditionNode({ data, selected }: NodeProps) {
  const d = data as unknown as ConditionNodeData

  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[200px] ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>🔀</span>
        <span className="font-medium text-sm text-slate-700">Condition</span>
      </div>
      <p className="text-xs text-slate-500">
        {d.field || 'No field'} {d.operator || 'equals'} {d.value || '""'}
      </p>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3" style={{ left: '30%' }} />
      <Handle type="source" position={Position.Bottom} id="false" className="w-3 h-3" style={{ left: '70%' }} />
    </div>
  )
}
