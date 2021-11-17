class Category {
  id?: number
  title: string = ""
  thumbnails: {
    sm: string
    md: string
    lg: string
    original: string
  } = {
    sm: "",
    md: "",
    lg: "",
    original: ""
  }

  parentId?: number
  otherCategories?: Array<Category>

  constructor(object?: any) {
    if (object && object.title && object.thumbnails) {
      this.id = object.id
      this.title = object.title
      this.thumbnails = object.thumbnails
      this.parentId = object.parentId
      this.otherCategories = object.otherCategories
    }
  }
}

export default Category