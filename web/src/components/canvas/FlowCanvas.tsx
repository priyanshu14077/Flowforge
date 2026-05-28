'use client'

import { useCallback, useState } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import NodePalette from './NodePalette'
import LLMNode from './nodes/LLMNode'
import HTTPNode from './nodes/HTTPNode'
import ConditionNode from './nodes/ConditionNode'
import type { NodeType, WorkflowDefinition, WorkflowNode } from '@/lib/types'

const nodeTypes = {
  llm: LLMNode,
  http: HTTPNode,
  condition: ConditionNode,
}

interface FlowCanvasProps {
  initialDefinition?: WorkflowDefinition
  onSave?: (definition: WorkflowDefinition) => void
}

let nodeIdCounter = 0
const newId = () => `node_${++nodeIdCounter}`

export default function FlowCanvas({ initialDefinition, onSave }: FlowCanvasProps) {
  const initialNodes = (initialDefinition?.nodes || []) as Node[]
  const initialEdges = (initialDefinition?.edges || []) as Edge[]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [hasChanges, setHasChanges] = useState(false)

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, id: `e-${newId()}` }, eds))
      setHasChanges(true)
    },
    [setEdges]
  )

  const onAddNode = useCallback(
    (type: NodeType, data: Record<string, unknown>) => {
      const newNode: Node = {
        id: newId(),
        type,
        position: { x: 250 + Math.random() * 100, y: 100 + nodes.length * 120 },
        data,
      }
      setNodes((nds) => [...nds, newNode])
      setHasChanges(true)
    },
    [nodes, setNodes]
  )

  const onSaveDefinition = useCallback(() => {
    const definition: WorkflowDefinition = {
      nodes: nodes as unknown as WorkflowNode[],
      edges: edges.map(({ id, source, target, sourceHandle }) => ({
        id,
        source,
        target,
        sourceHandle,
      })),
    }
    onSave?.(definition)
    setHasChanges(false)
  }, [nodes, edges, onSave])

  return (
    <div className="flex h-full">
      <NodePalette onAddNode={onAddNode} />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
        {hasChanges && (
          <button
            onClick={onSaveDefinition}
            className="absolute bottom-6 right-6 px-5 py-2.5 bg-brand-600 text-white rounded-lg font-medium shadow-lg hover:bg-brand-700 transition-colors"
          >
            Save Workflow
          </button>
        )}
      </div>
    </div>
  )
}
