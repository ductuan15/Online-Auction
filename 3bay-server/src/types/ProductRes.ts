import pkg from '@prisma/client'


export interface ProductRes extends pkg.products{
  mainImg?: {
    sm: string
    md: string
    lg: string
    original: string
  }
  subImg?: string[];
}
