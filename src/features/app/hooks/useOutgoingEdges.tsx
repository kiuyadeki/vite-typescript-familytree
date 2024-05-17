import { useMemo } from 'react';
import { Edge } from 'reactflow';
import { PersonNodeData } from '../types/PersonNodeData';
import { useRecoilValue } from 'recoil';
import { selectedNodeState } from '../recoil/selectedNodeState';

function useOutgoingEdges(wholeEdges: Edge[]) {
  const selectedNode = useRecoilValue(selectedNodeState);
  const outgoingEdges = useMemo(() => {
    if (selectedNode) {
      return wholeEdges.filter(e => e.source === selectedNode.id);
    } else {
      return [];
    }
  }, [wholeEdges, selectedNode]);
  return outgoingEdges;
}

export default useOutgoingEdges;