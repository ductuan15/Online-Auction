import { CategoryAction, CategoryState } from './types'
import Category from '../../../data/category'
import _ from 'lodash'

export const initialCategoryState: CategoryState = {
  allCategories: [],
  currentCategory: undefined,
  openCreateDialog: false,
  openEditDialog: false,
}

export const categoryReducer = (
  state: CategoryState,
  action: CategoryAction,
) => {
  switch (action.type) {
    case 'ADD_ALL':
      return {
        ...state,
        allCategories: action.payload,
      }
    case 'ADD':
      return {
        ...state,
        allCategories: addNewCategory(state.allCategories, action.payload),
      }
    case 'UPDATE': {
      return {
        ...state,
        allCategories: updateCategory(state.allCategories, action.payload),
      }
    }
    case 'REMOVE':
      return {
        ...state,
        allCategories: removeCategory(state.allCategories, action.payload),
      }
    case 'OPEN_CREATE_DIALOG':
      return {
        ...state,
        openCreateDialog: action.payload,
      }
    case 'OPEN_EDIT_DIALOG':
      return {
        ...state,
        openEditDialog: action.payload,
      }
    case 'CLOSE_ALL_DIALOGS':
      return {
        ...state,
        openCreateDialog: false,
        openEditDialog: false,
        currentCategory: undefined,
      }
    case 'CURRENT_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload,
      }
    default:
      return state
  }
}

function addNewCategory(
  allCategories: Array<Category>,
  newCategory: Category,
): Array<Category> {
  if (!newCategory.parentId) {
    return [...allCategories, newCategory]
  }

  const categories = _.cloneDeep(allCategories)

  for (const category of categories) {
    traverseCategoryTree(category, newCategory.parentId, (parentCategory) => {
      parentCategory.otherCategories?.push(newCategory)
    })
  }
  return categories
}

function updateCategory(
  allCategories: Array<Category>,
  updatedCategory: Category,
) {
  const categories = _.cloneDeep(allCategories)

  if (!updatedCategory.parentId) {
    const index = _.findIndex(allCategories, { id: updatedCategory.id })
    categories.splice(index, 1, updatedCategory)
  } else {
    for (const category of categories) {
      traverseCategoryTree(
        category,
        updatedCategory.parentId,
        (parentCategory) => {
          if (!parentCategory.otherCategories) return
          const index = _.findIndex(parentCategory.otherCategories, {
            id: updatedCategory.id,
          })
          parentCategory.otherCategories.splice(index, 1, updatedCategory)
        },
      )
    }
  }

  return categories
}

function removeCategory(
  allCategories: Array<Category>,
  categoryToRemoved: Category,
) {
  const categories = _.cloneDeep(allCategories)

  if (!categoryToRemoved.parentId) {
    categories.filter((category) => category.id != categoryToRemoved.id)
  } else {
    for (const category of categories) {
      traverseCategoryTree(
        category,
        categoryToRemoved.parentId,
        (parentCategory) => {
          if (!parentCategory.otherCategories) return

          parentCategory.otherCategories =
            parentCategory.otherCategories.filter(
              (category) => category.id != categoryToRemoved.id,
            )
        },
      )
    }
  }

  return categories
}

function traverseCategoryTree(
  category: Category,
  id: number,
  cb: (category: Category) => void,
) {
  if (category.id === id) {
    cb(category)
  } else if (category.otherCategories) {
    for (const subCategory of category.otherCategories) {
      traverseCategoryTree(subCategory, id, cb)
    }
  }
}
