/**
 * 
 * Rounds of a number to the lesser nearest factor of passed baseNumber
 * @param number Number to be round off
 * @param baseNumber We'll return lesser nearest factor of this number
 * @returns Lesser nearest factor of baseNumber near number
 */
export const roundToLesserMultiple = (number: number, baseNumber: number) => Math.floor(number / baseNumber) * baseNumber;
