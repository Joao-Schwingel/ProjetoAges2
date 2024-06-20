export function formatDateToString(date: Date): string {
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedHour = new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${formattedDate} - ${formattedHour}`;
}
