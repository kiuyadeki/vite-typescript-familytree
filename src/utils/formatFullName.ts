interface NameData {
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
}

export function formatFullName(data: NameData): string {
  const { firstName, lastName } = data;
  if (!firstName && !lastName) return '';
  if (!firstName) return `${lastName}`;
  if (!lastName) return `${firstName}`;
  return `${firstName} ${lastName}`;
}