import { Dispatch, SetStateAction } from "react";
import { Edge, Node } from "reactflow";
import { PersonNodeData, MaritalNodeData } from "../types/PersonNodeData";
import { getAddedNodeId } from "../utils/getAddedNodeId";
import { createMaritalNode, createPersonNode } from "../utils/nodeUtils";
import { createEdge } from "../utils/edgeUtils";
import { BASE_MARITAL_SPACING } from "../utils/constants";
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedNodeState } from '../recoil/selectedNodeState';

export const useAddSpouseToSelectedNode = (
  setWholeNodes: Dispatch<SetStateAction<(PersonNodeData | MaritalNodeData)[]>>,
  setWholeEdges: Dispatch<SetStateAction<Edge[]>>,
  onUpdated: () => void
) => {
  const selectedNode = useRecoilValue(selectedNodeState);
  // const [lastAddedNode, setLastAddedNode] = useRecoilState(lastAddedNodeState);
  const addSpouseToSelectedNode = () => {
    if (selectedNode) {
      let selectedNodeMaritalPosition = selectedNode.data.maritalPosition;
      if (!selectedNodeMaritalPosition) {
        selectedNodeMaritalPosition = 'left';
      }
      const maritalNode = createMaritalNode({
        x: selectedNode.position.x + BASE_MARITAL_SPACING,
        y: selectedNode.position.y,
      });

      const selectedToMaritalEdge = createEdge(
        selectedNode.id,
        maritalNode.id,
        "smoothstep",
        "personSourceRight",
        "maritalTargetLeft"
      );

      const SpouseNode = createPersonNode(
        { x: selectedNode.position.x + BASE_MARITAL_SPACING * 2, y: selectedNode.position.y },
        {
          spouse: [selectedNode.id],
          maritalNodeId: maritalNode.id,
          maritalPosition: selectedNodeMaritalPosition === 'left'  ? 'right' : 'left'
        }
      );
      // setLastAddedNode(SpouseNode);

      const spouseToMaritalEdge = createEdge(
        SpouseNode.id,
        maritalNode.id,
        "smoothstep",
        "personSourceLeft",
        "maritalTargetRight"
      );

      let updatedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          spouse: [SpouseNode.id],
          maritalNodeId: maritalNode.id,
          maritalPosition: selectedNodeMaritalPosition,
        },
      };

      setWholeNodes(prevNodes =>
        prevNodes.map(node => {
          return node.id === selectedNode.id ? updatedNode : node;
        })
      );

      setWholeNodes(prevNodes => [...prevNodes, maritalNode, SpouseNode]);
      const NewEdgeId = `edges-${SpouseNode.id}-${selectedNode.id}`;
      setWholeEdges(prevEdges => [...prevEdges, selectedToMaritalEdge, spouseToMaritalEdge]);
      if (onUpdated) {
        onUpdated();
      }
    }
  };

  return addSpouseToSelectedNode;
};
