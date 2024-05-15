
import { PersonNodeData, MaritalNodeData } from "../types/PersonNodeData";
import {
  BASE_GENERATIONS_SPACING,
  BASE_MARITAL_NODE_HEIGHT,
  BASE_MARITAL_NODE_WIDTH,
  BASE_MARITAL_SPACING,
  BASE_PARENTS_GAP,
  BASE_PERSON_NODE_HEIGHT,
  BASE_PERSON_NODE_WIDTH,
  BASE_SIBLINGS_SPACING,
} from "./constants";
import { isPersonNodeData } from '../typeGuards/personTypeGuards';

const setDescendants = (wholeNodes: (PersonNodeData | MaritalNodeData)[]) => {
  const calculatedNodes = new Map<string, number[]>();
  const calculatedNodeWidths = new Map<string, number[]>();

  function calculateNodeDescendants(nodeId: string, ancestors: string[] = []): [number[]] {
    if (calculatedNodes.has(nodeId)) {
      return [calculatedNodeWidths.get(nodeId)!];
    }

    if (ancestors.includes(nodeId)) {
      return [[0]];
    }

    const node = wholeNodes.find(node => node.id === nodeId) as PersonNodeData | undefined;
    if (!node || node.type !== "person" || !node.data.children.length) {
      const defaultSpacing = node?.data.spouse.length
        ? BASE_MARITAL_SPACING * 2 + BASE_SIBLINGS_SPACING
        : BASE_SIBLINGS_SPACING;
      return [[defaultSpacing]];
    }

    let childWidths = node.data.children.map(childId => {
      const [widths] = calculateNodeDescendants(childId, [...ancestors, nodeId]);
      return widths;
    });

    if (node.data.children.length === 1) {
      const childNode = wholeNodes.find(n => n.id === node.data.children[0]);
      if (childNode && childNode.type === "person" && !childNode.data.spouse.length) {
        childWidths = [[BASE_MARITAL_SPACING * 2 + BASE_SIBLINGS_SPACING]];
      }
    }

    const descendantWidths = childWidths.map(array => array.reduce((a, b) => a + b, 0));
    calculatedNodeWidths.set(nodeId, descendantWidths);
    return [descendantWidths];
  }

  wholeNodes.forEach(node => {
    if (node.type === "person") {
      const [descendantWidths] = calculateNodeDescendants(node.id);
      if ("descendantsWidth" in node.data) node.data.descendantsWidth = descendantWidths.reduce((a, b) => a + b, 0);
    }
  });
};

const setAncestors = (wholeNodes: (PersonNodeData | MaritalNodeData)[]) => {
  const calculatedNodes = new Map<string, number[]>();

  function calculateNodeAncestors(nodeId: string, ancestors: string[] = []): number[] {
    if (calculatedNodes.has(nodeId)) {
      return calculatedNodes.get(nodeId)!;
    }

    const node = wholeNodes.find(node => node.id === nodeId) as PersonNodeData | undefined;
    if (!node || node.type !== "person" || !node.data.parents.length) {
      return [1];
    }

    const parentCounts = node.data.parents.map(parentId => {
      const counts = calculateNodeAncestors(parentId, [...ancestors, nodeId]);
      return counts;
    });

    const maxParentsCount = parentCounts.map(array => array.reduce((a, b) => a + b, 0));

    calculatedNodes.set(nodeId, maxParentsCount);
    return maxParentsCount;
  }

  wholeNodes.forEach(node => {
    if (node.type === "person") {
      const maxParentsCount = calculateNodeAncestors(node.id);
      if ("ancestors" in node.data) node.data.ancestors = maxParentsCount.reduce((a, b) => a + b, 0);
    }
  });
};

const calculateChildNodePosition = (
  wholeNodes: (PersonNodeData | MaritalNodeData)[],
  node: PersonNodeData | MaritalNodeData,
  level: number,
  offsetX: number
) => {
  if (!node) return;
  node.position.y = level * BASE_GENERATIONS_SPACING;
  if (node.type === "person") {
    const nodeDescendantsWidth = node.data.descendantsWidth;
    const nodeMaritalPosition = node.data.maritalPosition;

    switch (nodeMaritalPosition) {
      case "left":
        node.position.x = offsetX + (nodeDescendantsWidth - BASE_SIBLINGS_SPACING) / 2 - BASE_MARITAL_SPACING;
        break;
      case "right":
        node.position.x = offsetX + (nodeDescendantsWidth - BASE_SIBLINGS_SPACING) / 2 + BASE_MARITAL_SPACING;
        break;
      default:
        if (!(node.data.siblings.length > 1)) {
          node.position.x = offsetX + BASE_MARITAL_SPACING;
        } else {
          node.position.x = offsetX;
        }
    }
    // 配偶者の位置計算
    node.data.spouse.forEach(spouseId => {
      const spouseNode = wholeNodes.find(n => n.id === spouseId);
      if (spouseNode) {
        switch (nodeMaritalPosition) {
          case "left":
            spouseNode.position.x = node.position.x + BASE_MARITAL_SPACING * 2;
            break;
          case "right":
            spouseNode.position.x = node.position.x - BASE_MARITAL_SPACING * 2;
            break;
          default:
        }
        spouseNode.position.y = node.position.y;
      }
    });

    // maritalノードの位置計算
    if (node.data.maritalNodeId) {
      const maritalNode = wholeNodes.find(n => n.id === node.data.maritalNodeId);
      if (maritalNode) {
        maritalNode.position.y = node.position.y + (BASE_PERSON_NODE_HEIGHT - BASE_MARITAL_NODE_HEIGHT) / 2;
        switch (nodeMaritalPosition) {
          case "left":
            maritalNode.position.x =
              node.position.x + BASE_MARITAL_SPACING + (BASE_PERSON_NODE_WIDTH - BASE_MARITAL_NODE_WIDTH) / 2;
            break;
          case "right":
            maritalNode.position.x =
              node.position.x - BASE_MARITAL_SPACING + (BASE_PERSON_NODE_WIDTH - BASE_MARITAL_NODE_WIDTH) / 2;
            break;
          default:
        }
      }
    }

    // 子供の位置計算
    let cumulativeOffset = offsetX;
    const childrenCounts = node.data.children.length;
    node.data.children.forEach(childId => {
      const childNode = wholeNodes.find(n => n.id === childId) as PersonNodeData;
      if (childNode) {
        calculateChildNodePosition(wholeNodes, childNode, level + 1, cumulativeOffset);
        if (childNode.data.children.length) {
          cumulativeOffset += childNode.data.descendantsWidth;
        } else {
          cumulativeOffset += BASE_SIBLINGS_SPACING;
        }
      }
    });
  } else if (node.type === "marital") {
    node.position.x = offsetX + BASE_MARITAL_SPACING;
  }
};

const calculateParentNodePosition = (
  wholeNodes: (PersonNodeData | MaritalNodeData)[],
  node: PersonNodeData | MaritalNodeData,
  selectedNode: PersonNodeData,
  level: number,
  offsetX: number,
  ancestorsSide: "left" | "right" | ""
) => {
  if (!node || !selectedNode) return;
  node.position.y = -level * BASE_GENERATIONS_SPACING;
  if (node.type === "person") {
    const nodeMaritalPosition = node.data.maritalPosition;
    let parentOffset = node.data.ancestors * BASE_MARITAL_SPACING;

    switch (ancestorsSide) {
      case "left":
        const rightParentNode = wholeNodes.find(
          parentNode =>
            parentNode.type === "person" &&
            node.data.parents.includes(parentNode.id) &&
            parentNode.data.maritalPosition === "right"
        ) as PersonNodeData;
        if (rightParentNode) {
          parentOffset =
            -rightParentNode.data.ancestors * BASE_MARITAL_SPACING -
            (rightParentNode.data.ancestors - 1) * BASE_PARENTS_GAP;
        }
        break;
      case "right":
        const leftParentNode = wholeNodes.find(
          parentNode =>
            parentNode.type === "person" &&
            node.data.parents.includes(parentNode.id) &&
            parentNode.data.maritalPosition === "left"
        ) as PersonNodeData;
        if (leftParentNode) {
          parentOffset =
            leftParentNode.data.ancestors * BASE_MARITAL_SPACING +
            (leftParentNode.data.ancestors - 1) * BASE_PARENTS_GAP;
        }
        break;
      default:
    }

    if (!(node.id === selectedNode.id)) {
      switch (nodeMaritalPosition) {
        case "left":
          node.position.x = offsetX - BASE_MARITAL_SPACING;
          break;
        case "right":
          node.position.x = offsetX + BASE_MARITAL_SPACING;
          break;
        default:
      }

      // maritalノードの位置計算
      if (node.data.maritalNodeId) {
        const maritalNode = wholeNodes.find(n => n.id === node.data.maritalNodeId);
        if (maritalNode) {
          maritalNode.position.y = node.position.y + (BASE_PERSON_NODE_HEIGHT - BASE_MARITAL_NODE_HEIGHT) / 2;
          switch (nodeMaritalPosition) {
            case "left":
              maritalNode.position.x =
                node.position.x + BASE_MARITAL_SPACING + (BASE_PERSON_NODE_WIDTH - BASE_MARITAL_NODE_WIDTH) / 2;
              break;
            case "right":
              maritalNode.position.x =
                node.position.x - BASE_MARITAL_SPACING + (BASE_PERSON_NODE_WIDTH - BASE_MARITAL_NODE_WIDTH) / 2;
              break;
            default:
          }
        }
      }
    }

    node.data.parents.forEach(parentId => {
      const parentNode = wholeNodes.find(n => n.id === parentId) as PersonNodeData;
      if (node.id === selectedNode.id && parentNode.data.maritalPosition) {
        if (parentNode.data.maritalPosition === "left") {
          calculateParentNodePosition(
            wholeNodes,
            parentNode,
            node,
            level + 1,
            node.position.x,
            parentNode.data.maritalPosition
          );
        } else if (parentNode.data.maritalPosition === "right") {
          calculateParentNodePosition(
            wholeNodes,
            parentNode,
            node,
            level + 1,
            node.position.x,
            parentNode.data.maritalPosition
          );
        }
      } else if (parentNode && parentNode.data.maritalPosition) {
        calculateParentNodePosition(
          wholeNodes,
          parentNode,
          node,
          level + 1,
          node.position.x + parentOffset,
          parentNode.data.maritalPosition
        );
      }
    });
  }
};

export function calculateNodesPosition(
  wholeNodes: (PersonNodeData | MaritalNodeData)[],
  selectedNode: PersonNodeData | null
) {
  if (!selectedNode) return;
  const wholeNodesCopy: (PersonNodeData | MaritalNodeData)[] = structuredClone(wholeNodes);
  const selectedNodesCopy = wholeNodesCopy.find(node => node.id === selectedNode.id);
  if (!selectedNodesCopy || !isPersonNodeData(selectedNodesCopy)) return;
  setDescendants(wholeNodesCopy);
  setAncestors(wholeNodesCopy);

  const siblingsNodes = wholeNodesCopy.filter(node => selectedNodesCopy.data.siblings.includes(node.id));
  const sortedSiblingsNodes = siblingsNodes.sort((a, b) => {
    const getAge = (node: PersonNodeData) => {
      const birthYear = node.data.birthYear;
      return birthYear ? new Date().getFullYear() - birthYear : -Infinity;
    };
    if(!isPersonNodeData(a) || !isPersonNodeData(b)) return 0;
    const ageA = getAge(a);
    const ageB = getAge(b);
  
    if (ageA > ageB) return -1;
    if (ageA < ageB) return 1;
    return parseInt(a.id, 10) - parseInt(b.id, 10);
  });
  let siblingsOffset = 0;
  sortedSiblingsNodes.forEach(node => {
    calculateChildNodePosition(wholeNodesCopy, node, 0, siblingsOffset);
    if ("data" in node && node.type === "person" && node.data.descendantsWidth) {
      siblingsOffset += node.data.descendantsWidth;
    }
  });
  calculateParentNodePosition(wholeNodesCopy, selectedNodesCopy, selectedNodesCopy, 0, 0, "");
  return wholeNodesCopy;
}
