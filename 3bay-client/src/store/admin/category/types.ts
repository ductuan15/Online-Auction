import Category from '../../../data/category'

export type CategoryState = {
  allCategories: Array<Category>
  currentCategory?: Category
}

export type CategoryAction =
  | { type: 'ADD_ALL'; payload: Array<Category> }
  | { type: 'ADD'; payload: Category }
  | { type: 'UPDATE'; payload: Category }
  | { type: 'REMOVE'; payload: Category }
