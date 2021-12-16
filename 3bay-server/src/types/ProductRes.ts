import Prisma from '@prisma/client'

export interface ProductRes extends Prisma.Product {
  thumbnails?: {
    sm: string
    md: string
    lg: string
    original: string
  }
  detail?: string[]
  auctions?: Prisma.Auction[]
}
