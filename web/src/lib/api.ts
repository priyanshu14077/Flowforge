const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

let token: string | null = null

export function setToken(t: string) {
  token = t
}

export function getToken(): string | null {
  return token
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  auth: {
    signup: (email: string, password: string, name?: string) =>
      request<{ token: string; user: { id: string; email: string; name?: string } }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; email: string; name?: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  workflows: {
    list: () => request<Workflow[]>('/workflows'),
    get: (id: string) => request<Workflow>(`/workflows/${id}`),
    create: (data: { name: string; description?: string; definition: WorkflowDefinition }) =>
      request<Workflow>('/workflows', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { name?: string; description?: string; definition?: WorkflowDefinition }) =>
      request<Workflow>(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/workflows/${id}`, { method: 'DELETE' }),
    run: (id: string) => request<{ runId: string; status: string }>(`/workflows/${id}/run`, { method: 'POST' }),
    runs: (id: string) => request<WorkflowRun[]>(`/workflows/${id}/runs`),
  },
}

export type { Workflow, WorkflowDefinition, WorkflowRun }