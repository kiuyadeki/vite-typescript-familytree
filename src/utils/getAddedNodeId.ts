import { v4 as uuidv4 } from 'uuid';

let nodeIdCounter = 0;
export const getAddedNodeId = () => `${++nodeIdCounter}`;