import { format } from 'date-fns';

function reduceDescription(text) {
  return text.replace(/^(.{140}[^\W]*).*/gm, '$1...');
}

function formatDate(date) {
  try {
    return format(new Date(date), 'PP');
  } catch {
    return 'The date is missing';
  }
}

function setBorderStyle(value) {
  if (value <= 3) return 'rating-red';
  if (value > 3 && value <= 5) return 'rating-orange';
  if (value > 5 && value <= 7) return 'rating-yellow';
  return 'rating-green';
}

export { reduceDescription, formatDate, setBorderStyle };
