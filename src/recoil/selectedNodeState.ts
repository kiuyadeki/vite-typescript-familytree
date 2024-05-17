import { atom } from 'recoil';
import { PersonNodeData } from '../features/app/types/PersonNodeData';

export const selectedNodeState = atom<PersonNodeData | null>({
  key: "selectedNode",
  default: null,
})
