import {UserDetails} from "./user";

class Product {
  id?: number
  name = ''
  categoryId = 0
  sellerId = ''
  createdAt: Date | null = null
  deletedAt: Date | null = null
  currentPrice = 0
  auctions: Array<any> = []
  productDescriptionHistory: Array<any> = []

  thumbnails: {
    sm: string
    md: string
    lg: string
    original: string
  } = {
    sm: '',
    md: '',
    lg: '',
    original: '',
  }

  seller: UserDetails | null = null
  category: {
    id: string,
    title: string,
    parentId: string,
    createdAt: string
  } = {
    id: '',
    title: '',
    parentId: '',
    createdAt: ''
  }

  detail: Array<string> = []

  image = ''
  rate = 0
  buy_now_price?: number
  number_bidder = 0
  date = ''
  time = ''

  constructor(data: Partial<Product> = {}) {
    Object.assign(this, data)
  }
}

export default Product
