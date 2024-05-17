interface NameData {
  firstName: string;
  lastName: string;
}

export function formatFullName(data: NameData): string {
  const { firstName, lastName } = data;
  if (!firstName && !lastName) return '';
  if (!firstName) return `${lastName}`;
  if (!lastName) return `${firstName}`;
  return `${firstName} ${lastName}`;
}
