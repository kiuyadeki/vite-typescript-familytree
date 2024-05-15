import { useRecoilState, useRecoilValue } from "recoil";
import { wholeNodesState } from "../../recoil/WholeNodesState";
import { wholeEdgesState } from "../../recoil/WholeEdgesState";
import { selectedNodeState } from "../../recoil/selectedNodeState";
import { nodesUpdatedState } from "../../recoil/nodesUpdatedState";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { personNode } from "../parts/CustomNode";
import { maritalNode } from "../parts/MaritalStatusNode";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
} from "reactflow";
import { filterDirectLineagesNodes } from "../../utils/filterDirectLineageNodes";
import { calculateNodesPosition } from "../../utils/calculateNodesPosition";
import { isPersonNodeData } from "../../typeGuards/personTypeGuards";
import { PersonNodeData } from "../../types/PersonNodeData";
import { getSelectedNodePosition } from "../../utils/getSelectedNodePosition";
import { BASE_MARITAL_NODE_WIDTH, BASE_PERSON_NODE_HEIGHT, BASE_PERSON_NODE_WIDTH } from "../../utils/constants";
import { ParentChildEdge } from "../parts/ParentChildEdge";
import styled from "styled-components";

const OuterBox = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const FamilyTreeWrapper = (props: { openModal: () => void }) => {
  const { openModal } = props;
  const [wholeNodes, setWholeNodes] = useRecoilState(wholeNodesState);
  const [wholeEdges, setWholeEdges] = useRecoilState(wholeEdgesState);
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState);
  const [nodesUpdated, setNodesUpdated] = useRecoilState(nodesUpdatedState);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const nodeTypes = useMemo(() => ({ person: personNode, marital: maritalNode }), []);
  const edgeTypes = useMemo(() => ({ parentChild: ParentChildEdge }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(wholeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(wholeEdges as Edge[]);
  const onConnect = useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), []);
  const { setCenter } = useReactFlow();

  const { x, y, zoom } = useViewport();
  const reactFlowInstance = useReactFlow();
  useEffect(() => {
    setSelectedNode(wholeNodes[0] as PersonNodeData);
  }, []);

  useEffect(() => {
    reactFlowInstance.fitView({
      padding: 20,
    });
  }, [reactFlowInstance]);
  useEffect(() => {
    console.log("wholeNodes", wholeNodes);
    console.log("wholeEdges", wholeEdges);
    if (nodesUpdated && selectedNode) {
      const calculatedWholeNodes = calculateNodesPosition(wholeNodes, selectedNode);
      if (!calculatedWholeNodes) return;
      setWholeNodes(calculatedWholeNodes);
      const { directLineageNodes, directLineageEdges } = filterDirectLineagesNodes(
        calculatedWholeNodes,
        wholeEdges,
        selectedNode
      );
      setNodes(directLineageNodes);
      setEdges(directLineageEdges);
      setNodesUpdated(false);
      const [selectedNodePostionX, selectedNodePostionY] = getSelectedNodePosition(
        calculatedWholeNodes,
        selectedNode
      ) || [0, 0];
      setCenter(selectedNodePostionX + BASE_PERSON_NODE_WIDTH / 2, selectedNodePostionY + BASE_PERSON_NODE_HEIGHT / 2, {
        zoom,
        duration: 1000,
      });
    }
  }, [nodesUpdated]);

  useEffect(() => {
    if (selectedNode) {
      setNodesUpdated(true);
    }
  }, [selectedNode]);

  const handleNodeClick = (clickedNode: PersonNodeData) => {
    setSelectedNode(clickedNode);
    if (selectedNode && clickedNode.id === selectedNode.id) {
      openModal();
    }
  };

  return (
    <OuterBox className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(e, node) => {
          if (isPersonNodeData(node)) {
            handleNodeClick(node);
          }
        }}
        nodesDraggable={false}
        fitView
        fitViewOptions={{ padding: 10 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#ddd" variant={BackgroundVariant.Lines} gap={[340, 250]} />
      </ReactFlow>
    </OuterBox>
  );
};
