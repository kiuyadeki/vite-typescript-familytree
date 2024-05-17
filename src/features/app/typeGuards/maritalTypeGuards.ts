import { Node } from 'reactflow';
import { MaritalNodeData } from '../types/PersonNodeData';

export const isMaritalNodeData = function(node: Node): node is MaritalNodeData {
  return node.type === "marital" && 'data' in node && node.data !== undefined && 'isDivorced' in node.data;
}