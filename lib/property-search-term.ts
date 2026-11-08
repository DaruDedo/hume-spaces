export function propertySearchTerm(input: unknown) {
  if (typeof input !== 'string' || input.length > 120) return null;
  const term = input.trim().replace(/\s+/g, ' ').normalize('NFC');
  return /^[\p{L}\p{N}][\p{L}\p{N} &'’./()-]{1,59}$/u.test(term) ? term : null;
}
