import { Node } from 'reactflow';
import { PersonNodeData } from '../types/PersonNodeData';

export const isPersonNodeData = function(node: Node): node is PersonNodeData {
  return node.type === "person" && "data" in node && node.data != undefined;
}