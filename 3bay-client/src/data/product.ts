class Product {
  id?: number
  name = ''
  categoryId = 0
  sellerId = 0
  createdAt: Date | null = null
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

  detail: Array<string> = []

  constructor(data: Partial<Product> = {}) {
    Object.assign(this, data)
  }
}

export default Product
