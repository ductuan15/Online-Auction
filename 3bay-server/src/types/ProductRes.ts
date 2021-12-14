import pkg from '@prisma/client'

export interface ProductRes extends pkg.products {
  thumbnails?: {
    sm: string
    md: string
    lg: string
    original: string
  }
  detail?: string[]
  auctions?: pkg.auctions[]
}
