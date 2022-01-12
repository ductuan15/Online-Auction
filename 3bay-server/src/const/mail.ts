export enum MailType {
  TEST,
  VERIFY,
  RESET_PWD,
  AUCTION_BID_REJECTED,
  AUCTION_CLOSED_NO_WINNER,
  AUCTION_CLOSED_HAD_WINNER,
  AUCTION_NEW_BID,
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
  [MailType.AUCTION_CLOSED_HAD_WINNER, 'test.mjml'],
  [MailType.AUCTION_NEW_BID, 'test.mjml'],
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
    MailType.AUCTION_CLOSED_HAD_WINNER,
    (values) => {
      if (values.length !== 0) {
        return `Your auction for the product 「${values[0]}」has been closed`
      }
      return `One of your auctions has been closed`
    },
  ],
  // TODO update title
  [MailType.AUCTION_NEW_BID, 'New bid'],
])

export default MailType
