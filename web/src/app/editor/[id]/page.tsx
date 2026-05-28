'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { api, setToken } from '@/lib/api'
import type { Workflow, WorkflowDefinition } from '@/lib/api'

const FlowCanvas = dynamic(() => import('@/components/canvas/FlowCanvas'), { ssr: false })

export default function EditorPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    setToken(token)

    if (id === 'new') { setLoading(false); return }

    api.workflows.get(id)
      .then(setWorkflow)
      .catch((err) => {
        console.error(err)
        if (err.message.includes('404')) {
          alert('Workflow not found')
          router.push('/')
        }
      })
      .finally(() => setLoading(false))
  }, [id, router])

  const handleSave = async (definition: WorkflowDefinition) => {
    const token = localStorage.getItem('token')!
    setToken(token)

    if (id === 'new') {
      const created = await api.workflows.create({
        name: 'Untitled Workflow',
        definition,
      })
      router.replace(`/editor/${created.id}`)
    } else {
      await api.workflows.update(id, { definition })
      // refresh workflow data
      const updated = await api.workflows.get(id)
      setWorkflow(updated)
    }
  }

  const handleRun = async () => {
    if (id === 'new') return
    try {
      const result = await api.workflows.run(id)
      alert(`Run started! Run ID: ${result.runId}`)
    } catch (err) {
      alert(`Failed to start: ${err instanceof Error ? err.message : err}`)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4">
        <button onClick={() => router.push('/')} className="text-slate-500 hover:text-slate-700 text-sm">
          ← Back
        </button>
        <h1 className="font-semibold text-slate-900 flex-1">
          {id === 'new' ? 'New Workflow' : (workflow?.name || 'Editor')}
        </h1>
        <div className="flex items-center gap-2">
          {id !== 'new' && (
            <>
              <button
                onClick={handleRun}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
              >
                ▶ Run
              </button>
              <button
                onClick={() => {
                  const runs = api.workflows.runs(id)
                  runs.then((r) => {
                    if (r.length === 0) { alert('No runs yet') }
                    else { alert(`${r.length} runs found. Latest: ${r[0].status}`) }
                  })
                }}
                className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 text-sm"
              >
                View Runs
              </button>
            </>
          )}
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <FlowCanvas
          initialDefinition={workflow?.definition as WorkflowDefinition | undefined}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
