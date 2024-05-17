import { Edge } from 'reactflow';
import { atom } from 'recoil';

const initialEdges: Edge[] = [];

export const wholeEdgesState = atom<Edge[]>({
  key: "wholeEdgesState",
  default: initialEdges,
});