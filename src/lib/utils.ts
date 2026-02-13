const SWEDISH_DAYS = [
  'Söndag', 'Måndag', 'Tisdag', 'Onsdag',
  'Torsdag', 'Fredag', 'Lördag'
];

const SWEDISH_MONTHS = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december'
];

export function formatSwedishDate(dateString: string) {
  const date = new Date(dateString + 'T00:00:00');
  const dayName = SWEDISH_DAYS[date.getDay()];
  const day = date.getDate();
  const month = SWEDISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return {
    dayName,
    fullDate: `${day} ${month} ${year}`,
    shortDate: `${day} ${month}`,
  };
}

export function formatTime(timeString: string): string {
  return timeString.slice(0, 5);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'approved':
    case 'completed':
      return 'badge-success';
    case 'pending':
      return 'badge-pending';
    case 'rejected':
    case 'cancelled':
      return 'badge-rejected';
    default:
      return 'badge-neutral';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Väntar';
    case 'approved':
      return 'Godkänd';
    case 'rejected':
      return 'Nekad';
    case 'cancelled':
      return 'Avbokad';
    case 'completed':
      return 'Slutförd';
    case 'available':
      return 'Tillgänglig';
    case 'booked':
      return 'Bokad';
    default:
      return status;
  }
}
