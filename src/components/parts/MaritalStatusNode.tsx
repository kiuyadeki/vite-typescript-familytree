import { Handle, NodeProps, Position } from "reactflow";
import { BASE_MARITAL_NODE_HEIGHT, BASE_MARITAL_NODE_WIDTH } from "../../utils/constants";
import { MaritalData } from "../../types/PersonNodeData";
import { GiBigDiamondRing } from "react-icons/gi";
import { TfiUnlink } from "react-icons/tfi";
import { useRecoilState } from "recoil";
import { wholeNodesState } from "../../recoil/WholeNodesState";
import styled from "styled-components";

export const maritalNode = (props: NodeProps<MaritalData>) => {
  const { id, data } = props;
  const [wholeNodes, setWholeNodes] = useRecoilState(wholeNodesState);
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setWholeNodes(prevNodes => {
      const currentNodeId = prevNodes.findIndex(node => node.id === id);
      if (currentNodeId === -1) return prevNodes;
      const newNodes = [...prevNodes];
      newNodes[currentNodeId].data.isDivorced = !newNodes[currentNodeId].data.isDivorced;
      return newNodes;
    });
  };

  const StyledHandle = styled(Handle)`
    opacity: 0;
    border: none;
    pointer-events: none;
    background: #ccc;
    cursor: pointer;
  `;

  const NodeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${BASE_MARITAL_NODE_WIDTH}px;
    height: ${BASE_MARITAL_NODE_HEIGHT}px;
    border-radius: 50px;
    cursor: pointer;
  `;

  const NodeInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    transform: scale(1.3);
    width: ${BASE_MARITAL_NODE_WIDTH}px;
    height: ${BASE_MARITAL_NODE_HEIGHT}px;
    border-radius: 50px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  `;

  return (
    <NodeContainer onClick={handleClick}>
      <NodeInner>{!data.isDivorced ? <GiBigDiamondRing /> : <TfiUnlink />}</NodeInner>
      <StyledHandle type="target" position={Position.Right} id="maritalTargetRight" />
      <StyledHandle type="target" position={Position.Left} id="maritalTargetLeft" />
      <StyledHandle type="target" position={Position.Bottom} id="maritalTargetBottom" />
    </NodeContainer>
  );
};
