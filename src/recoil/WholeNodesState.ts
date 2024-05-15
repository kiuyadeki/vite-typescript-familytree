import { atom } from "recoil";
import { PersonNodeData, MaritalNodeData } from "../types/PersonNodeData";

export const initialNode: (PersonNodeData | MaritalNodeData) = 
  {
    id: "0",
    type: "person",
    data: {
      label: "Node",
      birthYear: null,
      birthMonth: null,
      birthDate: null,
      gender: undefined,
      profilePicture: null,
      profilePictureURL: null,
      parents: [],
      children: [],
      spouse: [],
      siblings: ["0"],
      descendants: 0,
      descendantsWidth: 0,
      maritalPosition: null,
      ancestors: 0,
      selected: true,
      isDivorced: false,
    },
    position: { x: 0, y: 0 },
  };

export const wholeNodesState = atom<(PersonNodeData | MaritalNodeData)[]>({
  key: "wholeNodesState",
  default: [initialNode],
  dangerouslyAllowMutability: true,
});
