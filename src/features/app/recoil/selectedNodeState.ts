import { atom } from 'recoil';
import { PersonNodeData } from '../types/PersonNodeData';

export const selectedNodeState = atom<PersonNodeData | null>({
  key: "selectedNode",
  default: null,
})
