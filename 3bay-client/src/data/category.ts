class Category {
  id?: number
  title = ''
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

  parent_id?: number
  other_categories?: Array<Category>

  constructor(data: Partial<Category> = {}) {
    Object.assign(this, data)
  }
}

export default Category
