import { roundToLesserMultiple } from "./math";


interface TicketDetails {
  series: string, number: number, lastFourNumber: number
}

export const checkLotteryWin = (ticketData: TicketDetails, result: LotteryResult) => {
  let wonCategory: PriceDetails & { location?: string } | null = null;

  // Looping through each price category
  for (let i = 0; i < result.prices.length; i++) {
    const resultCategory = result.prices[i];
    const { ticketNumbers } = result.prices[i];

    // Looping through ticket numbers in each category
    for (let j = 0; j < ticketNumbers.length; j++) {
      const wonTicketNumber = ticketNumbers[j];

      // Checking if the given number is a winning number
      if (checkIndividualWin(ticketData, wonTicketNumber)) {

        // Replacing the wonCategory with new category if the new category has a higher price
        if (parseInt(resultCategory.value) > parseInt(wonCategory?.value ?? '0')) {
          const { category, value } = resultCategory;
          wonCategory = { category, value };
          const location = typeof wonTicketNumber !== 'string' && wonTicketNumber.location
          if (location) wonCategory.location = location
        }

        break; // No need to loop in the current category again
      }
    }

  }

  return wonCategory;
}

export const checkLotteryWinForBook = (ticketData: TicketDetails, result: LotteryResult) => {
  const bookResult: Array<PriceDetails & { ticketNumber: string }> = []
  const ticketsInBook = getAllTicketNumberInBook(ticketData, { excludeSampleTicket: true });

  ticketsInBook.forEach(currentTicket => {
    const currentTicketResult = checkLotteryWin(currentTicket, result)
    if (currentTicketResult) {
      const { series, number } = currentTicket;
      bookResult.push({ ticketNumber: `${series} ${number}`, ...currentTicketResult })
    }
  })

  // Sort result such that highest price is first
  bookResult.sort((currentResult, nextResult) => (parseInt(currentResult.value) - parseInt(nextResult.value)))

  return bookResult;
}



export const checkIndividualWin = (ticketData: TicketDetails, winnerTicket: WinnerTicket | string) => {
  if (typeof winnerTicket === 'string')
    return ticketData.lastFourNumber.toString() === winnerTicket

  return (ticketData.series === winnerTicket.series && ticketData.number.toString() === winnerTicket.number)
}

export const checkResultOfSame = (ticketData: TicketDetails, result: LotteryResult) => {

  const setResult: Array<PriceDetails & { ticketNumber: string }> = []

  result.seriesList.forEach(series => {
    if (series === ticketData.series) return;

    const currentSeriesTicket: TicketDetails = { ...ticketData, series }
    const currentTicketResult = checkLotteryWin(currentSeriesTicket, result)
    if (currentTicketResult) {
      const { series, number } = currentSeriesTicket;
      setResult.push({ ticketNumber: `${series} ${number}`, ...currentTicketResult })
    }
  });

  // Sort result such that highest price is first
  setResult.sort((currentResult, nextResult) => (parseInt(currentResult.value) - parseInt(nextResult.value)))

  return setResult;
}

const getAllTicketNumberInBook = (sampleTicketInBook: TicketDetails, options = { excludeSampleTicket: false }) => {
  const ticketsInBook: TicketDetails[] = [];
  const { number, series } = sampleTicketInBook;

  let currentTicketNumber = roundToLesserMultiple(number, 25) - 1;

  for (let i = 0; i < 25; i++) {
    currentTicketNumber++;
    if (options.excludeSampleTicket && currentTicketNumber === number) continue;
    ticketsInBook.push({ series: series, number: currentTicketNumber, lastFourNumber: currentTicketNumber % 10000 })
  }

  return ticketsInBook;
}

