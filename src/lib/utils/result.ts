import { stringToDate } from './date';
import { getTextFromPdf } from './pdf';
import { priceDetailsRegex, resultTitleRegex, ticketNumberInResultRegex } from './regex';


/**
 *
 * Check if a given text is a price category text
 * @param text The text to check
 */
export const isPriceDetails = (text: string): PriceDetails | false => {
  const priceDetailsMatch = text.match(priceDetailsRegex);

  if (!priceDetailsMatch) return false;

  const category = priceDetailsMatch[1];
  const value = priceDetailsMatch[3];

  return { value, category };
};

/**
 *
 * Check if a given text is a ticket number
 * @param text The text to check
 */
export const isTicketNumber = (text: string): WinnerTicket | false => {
  const ticketNumberMatch = text.match(ticketNumberInResultRegex);

  if (!ticketNumberMatch) return false;

  const number = ticketNumberMatch[4];
  const series = ticketNumberMatch[3];
  const location = ticketNumberMatch[6];

  return { number, series, location };
};

/**
 * 
 * Checks ia a given text is a title of the result
 * @param text The text to check
 */
export const isResultTitle = (text: string): ResultMetaData | false => {
  const resultTitleMatch = text.match(resultTitleRegex);

  if (!resultTitleMatch) return false

  const date = stringToDate(resultTitleMatch[4].trim());
  const lotteryName = resultTitleMatch[1].trim();
  const drawNumber = resultTitleMatch[2].trim();

  return { lotteryName, date, drawNumber }
}


export const extractResultFromPDF = async (buffer: Buffer): Promise<LotteryResult> => {
  const textArrayFromPdf = await getTextFromPdf(buffer);

  const priceCategoryAndTicketArray: ({ type: 'price_category' } & PriceDetails | { type: 'ticket_details' } & WinnerTicket)[] = [];
  let metaData = null;
  const seriesList = new Set<string>([]);
  const priceList: PriceDetailsWithTicketNumbers[] = [];

  textArrayFromPdf.forEach((text) => {
    const priceCategoryObject = isPriceDetails(text);
    const ticketNumberObject = isTicketNumber(text);
    const parsedMetaData = isResultTitle(text);

    if (parsedMetaData) metaData = parsedMetaData

    if (priceCategoryObject)
      priceCategoryAndTicketArray.push({ type: 'price_category', ...priceCategoryObject });

    if (ticketNumberObject) {
      if (ticketNumberObject.series) seriesList.add(ticketNumberObject.series)
      priceCategoryAndTicketArray.push({ type: 'ticket_details', ...ticketNumberObject });
    }
  });

  priceCategoryAndTicketArray.forEach((priceCategoryOrTicket) => {

    // If the object is priceCategory, create a new object with corresponding price and empty ticketNumbers array
    if (priceCategoryOrTicket.type === 'price_category') {
      const { value, category } = priceCategoryOrTicket;
      priceList.push({
        value,
        category,
        ticketNumbers: []
      })
      return;
    }

    // If the object is ticket details, append it to the current price Category
    if (priceCategoryOrTicket.type === 'ticket_details') {
      const { number, series, location } = priceCategoryOrTicket;

      priceList.at(-1)?.ticketNumbers.push((!series && !location) ? number : { number, series, location })
    }
  });

  return {
    metaData,
    prices: priceList,
    seriesList: [...seriesList],
  }
}