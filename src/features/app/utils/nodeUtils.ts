import { getAddedNodeId } from "./getAddedNodeId";
import { PersonNodeData, MaritalNodeData } from "../types/PersonNodeData";

export const createMaritalNode = (position: MaritalNodeData["position"]): MaritalNodeData => {
  const maritalId = getAddedNodeId();
  return {
    type: "marital",
    id: maritalId,
    data: { isDivorced: false },
    position: { x: position.x, y: position.y },
  };
};

export const createPersonNode = (position: PersonNodeData["position"], dataOverrides = {}): PersonNodeData => {
  const nodeId = getAddedNodeId();
  return {
    type: "person",
    id: nodeId,
    data: {
      label: nodeId,
      parents: [],
      children: [],
      spouse: [],
      siblings: [nodeId],
      descendants: 0,
      descendantsWidth: 0,
      ancestors: 0,
      maritalPosition: null,
      selected: false,
      isDivorced: false,
      ...dataOverrides,
    },
    position: { ...position },
  };
};
