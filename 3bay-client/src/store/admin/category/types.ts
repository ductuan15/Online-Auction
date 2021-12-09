import Category from '../../../data/category'

export type CategoryState = {
  allCategories: Array<Category>
  currentCategory?: Category
  openCreateDialog: boolean
  openEditDialog: boolean
}

export type CategoryAction =
  | { type: 'ADD_ALL'; payload: Array<Category> }
  | { type: 'ADD'; payload: Category }
  | { type: 'UPDATE'; payload: Category }
  | { type: 'REMOVE'; payload: Category }
  | { type: 'OPEN_CREATE_DIALOG'; payload: boolean }
  | { type: 'OPEN_EDIT_DIALOG'; payload: boolean }
  | { type: 'CLOSE_ALL_DIALOGS' }
  | { type: 'CURRENT_CATEGORY'; payload: Category | undefined }
