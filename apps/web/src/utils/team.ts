export function getTeamPlaceholderImage(name: string) {
  let initials = '';

  if (!name.trim()) initials == '?';

  for (const part of name.trim().split(/\s+/)) {
    initials += part?.at(0)?.toUpperCase() || '';
  }

  // TODO: get themecolors
  return `https://placehold.co/180x180/A6ADC8/313244?text=${initials}`;
}
