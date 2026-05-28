'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { TemplateItem } from '@/lib/landingassets'
import { nodeColors } from '@/lib/landingassets'

interface TemplateCardProps {
  template: TemplateItem
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="template-card bg-[#0F172A] border border-slate-800 rounded-2xl p-5 cursor-pointer">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{template.emoji}</span>
        <h3 className="text-white font-semibold text-sm">{template.name}</h3>
      </div>

      <p className="text-slate-400 text-xs mb-4 leading-relaxed">
        {template.description}
      </p>

      {/* Mini node graph */}
      <div className="flex items-center gap-1.5 mb-4 overflow-hidden">
        {template.nodes.map((node, i) => {
          const colors = nodeColors[node.type]
          return (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
              >
                {node.type.charAt(0).toUpperCase()}
              </div>
              {i < template.nodes.length - 1 && (
                <div className="w-4 h-px bg-slate-700" />
              )}
            </div>
          )
        })}
      </div>

      <Link
        href={template.href}
        className="inline-flex items-center gap-1 text-indigo-400 text-xs font-medium hover:text-indigo-300 transition-colors"
      >
        Use template
        <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
