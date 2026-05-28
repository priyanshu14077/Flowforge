import { runLLMNode as groqRunLLM } from '../groq/client.js'

export interface AutomationInput {
  workflowId: string
  runId: string
  definition: {
    nodes: Array<{ id: string; type: string; [key: string]: unknown }>
    edges: Array<{ id: string; source: string; target: string; sourceHandle?: string }>
  }
}

export async function runAutomation(input: AutomationInput): Promise<Record<string, unknown>> {
  const { nodes, edges } = input.definition

  // Build adjacency maps
  const incoming = new Map<string, string[]>()
  for (const edge of edges) {
    if (!incoming.has(edge.target)) incoming.set(edge.target, [])
    incoming.get(edge.target)!.push(edge.source)
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const visited = new Set<string>()
  const results = new Map<string, unknown>()

  async function executeNode(nodeId: string): Promise<unknown> {
    if (visited.has(nodeId)) return results.get(nodeId)
    visited.add(nodeId)

    const node = nodeMap.get(nodeId)
    if (!node) throw new Error(`Node ${nodeId} not found`)

    // Collect inputs from all parent nodes
    const parents = incoming.get(nodeId) || []
    const context: Record<string, unknown> = {}
    for (const parentId of parents) {
      const parentResult = await executeNode(parentId)
      context[parentId] = parentResult
    }

    let result: unknown

    if (node.type === 'llm') {
      result = await groqRunLLM(
        node.model as string,
        node.prompt as string,
        node.systemPrompt as string | undefined,
        context
      )
    } else if (node.type === 'http') {
      result = await runHTTPNode(node, context)
    } else if (node.type === 'condition') {
      result = await runConditionNode(node, context)
    } else {
      throw new Error(`Unknown node type: ${node.type}`)
    }

    results.set(nodeId, result)
    return result
  }

  // Find start nodes (no incoming edges) and execute all of them
  const startNodes = nodes.filter((n) => !incoming.has(n.id) || incoming.get(n.id)!.length === 0)
  await Promise.all(startNodes.map((n) => executeNode(n.id)))

  return Object.fromEntries(results)
}

async function runHTTPNode(
  node: { url: string; method: string; headers?: Record<string, string>; body?: string },
  context: Record<string, unknown>
): Promise<unknown> {
  const interpolate = (str: string) =>
    str.replace(/\{\{(\w+)\}\}/g, (_, key) => JSON.stringify(context[key] ?? ''))

  const url = interpolate(node.url)
  const body = node.body ? interpolate(node.body) : undefined
  const headers = node.headers
    ? Object.fromEntries(Object.entries(node.headers).map(([k, v]) => [k, interpolate(v)]))
    : undefined

  const res = await fetch(url, { method: node.method, headers, body })
  const text = await res.text()
  return { status: res.status, body: text }
}

async function runConditionNode(
  node: { field: string; operator: string; value: string },
  context: Record<string, unknown>
): Promise<boolean> {
  const fieldValue = node.field.split('.').reduce((obj: unknown, key) => {
    if (obj && typeof obj === 'object' && key in obj) return (obj as Record<string, unknown>)[key]
    return undefined
  }, context) as unknown

  const strValue = String(fieldValue ?? '')
  const compareValue = node.value

  switch (node.operator) {
    case 'equals': return strValue === compareValue
    case 'not_equals': return strValue !== compareValue
    case 'contains': return strValue.includes(compareValue)
    case 'not_contains': return !strValue.includes(compareValue)
    case 'exists': return fieldValue !== undefined && fieldValue !== null
    case 'not_exists': return fieldValue === undefined || fieldValue === null
    default: return false
  }
}