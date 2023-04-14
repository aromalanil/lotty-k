
import PDFParser from 'pdf2json';
import type { Output } from 'pdf2json'

/**
 *
 * Reads a pdf an returns all the text in it as an Array
 * @param buffer The PDF as Buffer
 * @returns  All text in the PDF file as an array
 */
export const getTextFromPdf = async (buffer: Buffer): Promise<string[]> => {
  const pdfData = await readPdfFromBuffer(buffer);

  const textArray: string[] = [];
  pdfData.Pages.forEach((page) => {
    page.Texts.forEach((text) => {
      textArray.push(decodeURIComponent(text.R[0].T));
    });
  });

  return textArray;
};

/**
 *
 * Utility function to read the pdf from buffer and return the data as JSON
 * @param buffer The PDF as Buffer
 * @returns PDF data as JSON
 */
export const readPdfFromBuffer = (buffer: Buffer): Promise<Output> =>
  new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', reject);
    pdfParser.on('pdfParser_dataReady', resolve);


    pdfParser.parseBuffer(buffer);
  });
