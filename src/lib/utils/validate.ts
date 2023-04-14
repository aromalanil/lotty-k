import { ticketNumberRegex } from './regex'

export const validateTicketNumber = (ticketNumber: string) => {
  const ticketNumberMatch = ticketNumber.match(ticketNumberRegex);
  if (!ticketNumberMatch) return false;

  const series = ticketNumberMatch[1];
  const number = parseInt(ticketNumberMatch[2]);
  const lastFourNumber = number % 10000;

  return { series, number, lastFourNumber }
}