export type UpgradeToSellerRequest = {
  userId: string
}

export type UserDetails = {
  uuid: string
  name: string
  email: string
  dob: string | null
  address: string
  role: string
  upgradeToSellerRequest?: UpgradeToSellerRequest
}

export type Bidder = {
  uuid: string,
  name: string
}

export type Watchlist = {
  userId: string
  productId: number
}

export type BidderComment = {
  bidderComment: string | null,
  bidderReview?: boolean
}

export type SellerComment = {
  sellerComment: string | null,
  sellerReview?: boolean
}