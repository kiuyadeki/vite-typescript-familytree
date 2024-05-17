import { Dispatch, SetStateAction } from "react";
import { Edge } from "reactflow";
import { PersonNodeData, MaritalNodeData } from "../types/PersonNodeData";
import { createMaritalNode, createPersonNode } from "../utils/nodeUtils";
import { createEdge } from "../utils/edgeUtils";
import { BASE_GENERATIONS_SPACING, BASE_MARITAL_NODE_HEIGHT, BASE_MARITAL_NODE_WIDTH, BASE_MARITAL_SPACING, BASE_PERSON_NODE_HEIGHT, BASE_PERSON_NODE_WIDTH } from "../utils/constants";
import { useRecoilValue } from 'recoil';
import { selectedNodeState } from '../recoil/selectedNodeState';

export const useAddParentToSelectedNode = (
  setWholeNodes: Dispatch<SetStateAction<(PersonNodeData | MaritalNodeData)[]>>,
  setWholeEdges: Dispatch<SetStateAction<Edge[]>>,
  onUpdated: () => void
) => {
  const selectedNode = useRecoilValue(selectedNodeState);
  const addParentToSelectedNode = () => {
    if (!selectedNode) return;

    const maritalNode = createMaritalNode({
      x: selectedNode.position.x  + (BASE_PERSON_NODE_WIDTH - BASE_MARITAL_NODE_WIDTH) / 2,
      y: selectedNode.position.y - BASE_GENERATIONS_SPACING + (BASE_PERSON_NODE_HEIGHT - BASE_MARITAL_NODE_HEIGHT) / 2,
    });
    const leftParentNode = createPersonNode(
      { x: selectedNode.position.x - BASE_MARITAL_SPACING, y: selectedNode.position.y - BASE_GENERATIONS_SPACING },
      { children: [selectedNode.id], maritalNodeId: maritalNode.id, maritalPosition: 'left' }
    );
    const rightParentNode = createPersonNode(
      { x: selectedNode.position.x + BASE_MARITAL_SPACING, y: selectedNode.position.y - BASE_GENERATIONS_SPACING },
      { children: [selectedNode.id], spouse: [leftParentNode.id], maritalNodeId: maritalNode.id, maritalPosition: 'right' }
    );
    leftParentNode.data.spouse.push(rightParentNode.id);

    const edgesToAdd = [
      createEdge(selectedNode.id, maritalNode.id, "smoothstep", "personSourceTop", "maritalTargetBottom"),
      createEdge(leftParentNode.id, maritalNode.id, "smoothstep", "personSourceRight", "maritalTargetLeft"),
      createEdge(rightParentNode.id, maritalNode.id, "smoothstep", "personSourceLeft", "maritalTargetRight"),
    ];

    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        parents: [leftParentNode.id, rightParentNode.id],
      },
    };

    setWholeNodes(prevNodes =>
      prevNodes
        .map(node => (node.id === selectedNode.id ? updatedNode : node))
        .concat([maritalNode, leftParentNode, rightParentNode])
    );
    setWholeEdges(prevEdges => [...prevEdges, ...edgesToAdd]);
    if (onUpdated) {
      onUpdated();
    }
  };

  return addParentToSelectedNode;
};
