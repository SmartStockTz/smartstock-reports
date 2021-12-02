export type CashSalesTrackModel = {
  id: string,
  amount: number,
  amount_refund: number,
  quantity_refund: number,
  date: string,
  time: string,
  channel: string,
  seller: string,
  customer: string,
  items: [
    {
      amount_refund: number,
      quantity_refund: number,
      product: string,
      quantity: number,
      amount: number
    },
    {
      amount_refund: number,
      quantity_refund: number,
      product: string,
      quantity: number,
      amount: number
    }
  ]
};
