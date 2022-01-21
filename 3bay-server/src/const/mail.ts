export enum MailType {
  TEST,
  VERIFY,
  RESET_PWD,
  AUCTION_BID_REJECTED,
  AUCTION_CLOSED_NO_WINNER,
  AUCTION_CLOSED_TO_BIDDER,
  AUCTION_CLOSED_TO_SELLER,
  AUCTION_NEW_BID_TO_BIDDER,
  AUCTION_NEW_BID_TO_SELLER,
  AUCTION_BID_REQUEST_ACCEPTED,
  AUCTION_BID_REQUEST_REJECTED,
}

export const mailFileNames: ReadonlyMap<MailType, string> = new Map([
  [MailType.TEST, 'test.mjml'],
  [MailType.VERIFY, 'verify.mjml'],
  [MailType.RESET_PWD, 'reset-password.mjml'],
  [MailType.AUCTION_BID_REJECTED, 'auction-bid-rejected.mjml'],
  [
    MailType.AUCTION_CLOSED_NO_WINNER,
    'auction-closed-no-winner.mjml',
  ],
  [MailType.AUCTION_CLOSED_TO_BIDDER, 'auction-closed-to-bidder.mjml'],
  [MailType.AUCTION_CLOSED_TO_SELLER, 'auction-closed-to-seller.mjml'],
  [MailType.AUCTION_NEW_BID_TO_BIDDER, 'auction-new-bid-to-bidder.mjml'],
  [MailType.AUCTION_NEW_BID_TO_SELLER, 'auction-new-bid-to-seller.mjml'],
  [MailType.AUCTION_BID_REQUEST_ACCEPTED, 'auction-bid-request-accepted.mjml'],
  [MailType.AUCTION_BID_REQUEST_REJECTED, 'auction-bid-request-rejected.mjml'],
])

export const mailTitles: ReadonlyMap<
  MailType,
  string | ((value: string[]) => string)
> = new Map<MailType, string | ((value: string[]) => string)>([
  [MailType.TEST, '[3bay]　テスト'],
  [MailType.VERIFY, 'Please verify your 3bay account'],
  [MailType.RESET_PWD, 'Reset your 3bay account password'],
  [MailType.AUCTION_BID_REJECTED, 'Your bid has been rejected by the seller'],
  [
    MailType.AUCTION_CLOSED_NO_WINNER,
    (values) => {
      if (values.length !== 0) {
        return `Your auction for the product 「${values[0]}」has been closed`
      }
      return `One of your auctions has been closed`
    },
  ],
  [
    MailType.AUCTION_CLOSED_TO_BIDDER,
    (values) => {
      if (values.length !== 0) {
        return `Your auction for the product 「${values[0]}」has been closed`
      }
      return `One of your auctions has been closed`
    },
  ],
  [
    MailType.AUCTION_CLOSED_TO_SELLER,
    (values) => {
      if (values.length !== 0) {
        return `You won the auction 「${values[0]}」`
      }
      return `You won an auction at 3bay`
    },
  ],
  [
    MailType.AUCTION_NEW_BID_TO_BIDDER,
    (values) => {
      if (values.length !== 0) {
        return `The price of「${values[0]}」has been updated`
      }
      return `Product update`
    },
  ],
  [
    MailType.AUCTION_NEW_BID_TO_SELLER,
    (values) => {
      if (values.length !== 0) {
        return `Your auction「${values[0]}」has been updated`
      }
      return `Product update`
    },
  ],
  [
    MailType.AUCTION_BID_REQUEST_ACCEPTED,
    (values) => {
      if (values.length !== 0) {
        return `Your bid request for「${values[0]}」has been accepted`
      }
      return `Your bid request has been accepted`
    },
  ],
  [
    MailType.AUCTION_BID_REQUEST_REJECTED,
    (values) => {
      if (values.length !== 0) {
        return `Your bid request for「${values[0]}」has been rejected`
      }
      return `Your bid request has been rejected`
    },
  ],
])

export default MailType
