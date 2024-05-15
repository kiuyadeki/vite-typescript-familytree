import { useRecoilState } from 'recoil';
import { selectedNodeState } from '../recoil/selectedNodeState';
import { MaritalNodeData, PersonNodeData } from '../types/PersonNodeData';
import { isPersonNodeData } from '../typeGuards/personTypeGuards';

export function getSelectedNodePosition(nodesList: (PersonNodeData | MaritalNodeData)[], selectedNode: PersonNodeData) {
  if(!selectedNode || !nodesList.length) return;
  const displayedNode = nodesList.find(node => node.id === selectedNode.id);
  if(!displayedNode || !isPersonNodeData(displayedNode)) return;
  if(displayedNode.position.x === undefined || !displayedNode.position.y === undefined) {
    return [selectedNode.position.x, selectedNode.position.y];
  }
  return [displayedNode.position.x, displayedNode.position.y];
}