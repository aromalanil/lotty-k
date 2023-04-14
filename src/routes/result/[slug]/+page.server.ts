
import { isDatesEqual, stringToDate } from '$lib/utils/date';
import { extractResultFromPDF } from '$lib/utils/result';
import { getLotteryResultPdf } from '$lib/utils/web-scrap';
import { validateTicketNumber } from '$lib/utils/validate.js';
import { checkLotteryWin, checkLotteryWinForBook, checkResultOfSame } from '$lib/utils/lottery.js';
import { result } from './utils';

/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {

  const ticketNumber = url.searchParams.get('ticket') ?? '';
  const parsedDate = stringToDate(params.slug);

  try {
    const pdfBuffer = await getLotteryResultPdf(params.slug);
    const result = await extractResultFromPDF(pdfBuffer);

    const { metaData, seriesList } = result

    const ticketData = validateTicketNumber(ticketNumber);
    if (!ticketData) throw new Error('Invalid Ticket Number');
    if (!seriesList.includes(ticketData.series)) throw new Error('Invalid Series');

    if (!isDatesEqual(parsedDate, metaData?.date)) throw new Error("Couldn't find result")

    const price = checkLotteryWin(ticketData, result);
    const bookWin = checkLotteryWinForBook(ticketData, result);
    const setWin = checkResultOfSame(ticketData, result);

    const response = {
      metaData,
      seriesList: [...seriesList],
      ...(price ? { price } : {}),
      ...(bookWin ? { bookWin } : {}),
      ...(setWin ? { setWin } : {}),
    };

    return { result: JSON.stringify(response, null, "\t") }
  }
  catch (error) {
    return {
      error: (error as Error)?.message
    }
  }
}