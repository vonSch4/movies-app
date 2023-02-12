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
  if (value <= 3) return '3px solid #E90000';
  if (value > 3 && value <= 5) return '3px solid #E97E00';
  if (value > 5 && value <= 7) return '3px solid #E9D100';
  return '3px solid #66E900';
}

export { reduceDescription, formatDate, setBorderStyle };
