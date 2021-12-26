import { Auction } from './auctions'
import { ProductDescriptionHistory } from './productDescriptionHistory'
import { UserDetails } from './user'

export interface Product {
  id?: number
  name: string
  categoryId: number
  sellerId: number
  createdAt: Date
  deletedAt: Date
  lastestAuctionId?: number
  lastestAuction?: Auction
  productDescriptionHistory: ProductDescriptionHistory[],

  thumbnails: {
    sm: string
    md: string
    lg: string
    original: string
  }

  seller: UserDetails
  category: {
    id: string
    title: string
    parentId: string
    createdAt: string
  }

  detail?: Array<string>
}

export default Product
