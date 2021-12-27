import { Auction } from './auctions'
import { ProductDescriptionHistory } from './productDescriptionHistory'
import { UserDetails } from './user'
import {AdminUserDetail} from './admin-user'

export interface Product {
  id?: number
  name: string
  categoryId: number
  sellerId: number
  createdAt: Date
  deletedAt: Date
  latestAuctionId?: number
  latestAuction?: Auction
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

export type AdminProductistResponse = {
  total: number,
  page: number,
  limit: number,
  products: Product[]
}

export default Product
