export type NotifyData = {
  type:
    | 'AUCTION_NEW_BID'
    | 'AUCTION_BID_REJECTED'
    | 'AUCTION_CLOSED_NO_WINNER'
    | 'AUCTION_CLOSED_HAD_WINNER'
  data: {
    id: number
    name: string
    sellerId: string
    thumbnails: {
      lg: string
      md: string
      sm: string
    }
  }
  date: Date
}

export function getNotificationDescription(
  notifyData: NotifyData,
  uuid: string | undefined,
) {
  switch (notifyData.type) {
    case 'AUCTION_BID_REJECTED':
      return 'Your bid has been rejected'
    case 'AUCTION_CLOSED_NO_WINNER':
      return 'The auction time of your product has been ended'
    case 'AUCTION_CLOSED_HAD_WINNER': {
      if (uuid === notifyData.data?.sellerId) {
        return 'The auction time of your product has been ended'
      }
      return `You have won the auction for the product「${notifyData?.data.name}」`
    }
    case 'AUCTION_NEW_BID':
      return `The price of「${notifyData.data.name}」has been updated`
  }
  return ''
}
