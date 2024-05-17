import { Edge } from 'reactflow'

export const createEdge = (
    source: Edge["source"], 
    target: Edge["target"], 
    type:Edge["type"] = 'smoothstep', 
    sourceHandle: Edge["sourceHandle"], 
    targetHandle: Edge["targetHandle"]
    ): Edge => {
  return {
    type,
    id: `edge-${source}-${target}`,
    source,
    sourceHandle,
    target,
    targetHandle,
    focusable: false,
    style: {
      stroke: '#FF0072'
    }
  }
}