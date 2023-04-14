export { }

declare global {
  type WinnerTicket = {
    number: string, series?: string, location?: string
  }

  interface PriceDetails {
    value: string, category: string
  }

  interface CategoryResult extends PriceDetails {
    ticketNumbers: Array<WinnerTicket | string>
  }

  interface ResultMetaData {
    date: Date,
    drawNumber: string,
    lotteryName: string,
  }

  interface PriceDetailsWithTicketNumbers extends PriceDetails {
    ticketNumbers: Array<WinnerTicket | string>
  }

  interface LotteryResult extends ResultMeta {
    seriesList: string[],
    metaData: ResultMetaData | null,
    prices: Array<PriceDetailsWithTicketNumbers>
  }
}