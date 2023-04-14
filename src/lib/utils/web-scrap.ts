import { load } from 'cheerio';
import axios from 'axios';

import { getBufferOfRemoteFile } from './http';
import { LOTTERY_WEBSITE_BASE_URL } from './constants';

/**
 * 
 * Scraps the `https://www.lotteryagent.kerala.gov.in/` website to get 
 * the link to the result pdf of the passed date
 * @param date The date of needed result
 * @returns The URL to pdf result of passed date
 */
export const getLotteryResultPdfUrl = async (date: string) => {
  const lotteryResultHtml = await getLotteryResultWebPage();
  const $ = load(lotteryResultHtml);

  // The href of anchor tag inside the table cell next to the table cell with the given date
  const relativeResultUrl = $(`td:contains("${date}")`).next().children().first().attr('href');

  if (!relativeResultUrl) throw new Error('Result Not Found');

  return `${LOTTERY_WEBSITE_BASE_URL}${relativeResultUrl}`;
}

/**
 * 
 * Returns the buffer of PDF result of given date
 * @param date The date of needed result
 * @returns The Buffer of the PDF result
 */
export const getLotteryResultPdf = async (date: string) => {
  const lotteryResultPdfUrl = await getLotteryResultPdfUrl(date);

  return getBufferOfRemoteFile(lotteryResultPdfUrl);
}

/**
 * 
 * Get the data of pdf result from internet
 * @returns Data of PDF result fetched from internet
 */
const getLotteryResultWebPage = async () => axios.get(`${LOTTERY_WEBSITE_BASE_URL}/result/public`).then(response => response.data)