'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, setToken } from '@/lib/api'
import type { Workflow } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    setToken(token)
    api.workflows.list()
      .then(setWorkflows)
      .catch((err) => {
        console.error(err)
        if (err.message.includes('401')) {
          localStorage.removeItem('token')
          router.push('/login')
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Flowforge</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              localStorage.removeItem('token')
              router.push('/login')
            }}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Sign out
          </button>
          <button
            onClick={() => router.push('/editor/new')}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            + New Workflow
          </button>
        </div>
      </header>
      <main className="p-6 max-w-6xl mx-auto">
        {workflows.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-4">No workflows yet</p>
            <button
              onClick={() => router.push('/editor/new')}
              className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
            >
              Create your first workflow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/editor/${wf.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{wf.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${wf.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {wf.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {wf.description && <p className="text-sm text-slate-500 mb-3">{wf.description}</p>}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{wf._count?.runs ?? 0} runs</span>
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{wf.webhookPath}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
