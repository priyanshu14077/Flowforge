export type NodeType = 'llm' | 'http' | 'condition'

export interface BaseNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
}

export interface LLMNodeData extends BaseNode {
  type: 'llm'
  model: string
  prompt: string
  systemPrompt?: string
}

export interface HTTPNodeData extends BaseNode {
  type: 'http'
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers?: Record<string, string>
  body?: string
}

export interface ConditionNodeData extends BaseNode {
  type: 'condition'
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'exists' | 'not_exists'
  value: string
}

export type WorkflowNode = LLMNodeData | HTTPNodeData | ConditionNodeData

export interface WorkflowDefinition {
  nodes: WorkflowNode[]
  edges: { id: string; source: string; target: string; sourceHandle?: string }[]
}

export interface WorkflowCreate {
  name: string
  description?: string
  definition: WorkflowDefinition
}