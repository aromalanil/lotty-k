
/**
 * 
 * Utility function to convert a date string to Date object
 * The date should be in `dd-mm-yyyy` or `dd/mm/yyyy` format.
 * @param dateString Date as string in `dd-mm-yyyy` or `dd/mm/yyyy` format.
 * @returns Date object of the passed date
 */
export const stringToDate = (dateString: string) => {
  const [date, month, year] = dateString.split(/[-/]/);

  return new Date(Date.parse(`${year}-${month}-${date}`));
}


/**
 * 
 * Check if two dates are equal or not
 * @param firstDate First date
 * @param secondDate Second Date
 * @returns Boolean representing if both dates are equal or not
 */
export const isDatesEqual = (firstDate: Date, secondDate: Date) => firstDate.getTime() === secondDate.getTime()
