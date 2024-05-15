import { Node } from "reactflow";

export interface BasicPersonInfo {
  firstName?: string | null;
  lastName?: string | null | undefined;
  gender?: string | undefined;
  profilePicture?: File | null | undefined;
  profilePictureURL?: string | null;
}

export interface BirthData {
  birthYear?: number | null | undefined;
  birthMonth?: number | null | undefined;
  birthDate?: number | null | undefined;
}

export interface FamilyData {
  parents: string[];
  children: string[];
  spouse: string[];
  descendants: number;
  descendantsWidth: number;
  ancestors: number;
  siblings: string[];
  maritalPosition: 'right' | 'left' | null;
  maritalNodeId?: string;
  isDivorced: boolean;
}

export interface PersonData extends BasicPersonInfo, BirthData, FamilyData {
  label: string;
  selected: boolean;
}

export interface MaritalData {
  isDivorced: boolean;
}

export interface PersonNodeData extends Node<PersonData> {
  type: "person";
  data: PersonData;
}

export interface MaritalNodeData extends Node<PersonData | MaritalData> {
  type: "marital";
  data: PersonData | MaritalData;
}
