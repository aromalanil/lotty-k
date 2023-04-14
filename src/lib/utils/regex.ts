export const priceDetailsRegex = /(1st|2nd|3rd|\dth|Cons)\s+Prize\s*-?\s*(Rs|₹)\s*:\s*(\d{3,})\/-/;
export const ticketNumberInResultRegex =
  /^(\d\s*\)\s*)?(([A-Z]{2})\s)?(\d{6}|\d{4}|)(\s*\(\s*([A-Z]+)\)\s*)?$/;
export const ticketNumberRegex = /^([A-Z]{2})\s([0-9]{6})$/;
export const resultTitleRegex = /^([A-Z\s\-0-9]+)LOTTERY NO\.([A-Z]{2}-\d+)(th|st|nd) DRAW held on:-\s+(\d{2}\/\d{2}\/\d{4}),(\d{1,2}:\d{2} [AP]M)$/
