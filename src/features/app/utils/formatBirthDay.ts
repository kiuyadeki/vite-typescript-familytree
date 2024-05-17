import { BirthData } from '../types/PersonNodeData';

export function formatBirthDay(data: BirthData): string {
  const { birthYear, birthMonth, birthDate } = data;
  if (!birthYear) return '';
  if (!birthMonth) return `${birthYear}`;
  if (!birthDate) return `${birthYear}/${birthMonth}`;

  return `${birthYear}/${birthMonth}/${birthDate}`;

}