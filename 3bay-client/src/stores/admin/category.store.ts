import Category from '../../data/category'
import _ from 'lodash'

export type CategoryState = {
  allCategories: Array<Category>
  currentCategory?: Category
  openCreateDialog: boolean
  openEditDialog: boolean
}

export type CategoryAction =
  | { type: 'ADD_ALL'; payload: Array<Category> }
  | { type: 'ADD'; payload: Category }
  | { type: 'UPDATE'; payload: { current: Category; updated: Category } }
  | { type: 'REMOVE'; payload: Category }
  | { type: 'OPEN_CREATE_DIALOG'; payload: boolean }
  | { type: 'OPEN_EDIT_DIALOG'; payload: boolean }
  | { type: 'CLOSE_ALL_DIALOGS' }
  | { type: 'CURRENT_CATEGORY'; payload: Category | undefined }

export const initialCategoryState: CategoryState = {
  allCategories: [],
  currentCategory: undefined,
  openCreateDialog: false,
  openEditDialog: false,
}

export const categoryReducer = (
  state: CategoryState,
  action: CategoryAction,
): CategoryState => {
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
        allCategories: updateCategory(
          state.allCategories,
          action.payload.current,
          action.payload.updated,
        ),
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
  current: Category,
  updated: Category,
) {
  if (current.parentId !== updated.parentId) {
    const cats = removeCategory(allCategories, current)
    return addNewCategory(cats, updated)
  }

  const categories = _.cloneDeep(allCategories)

  if (!updated.parentId) {
    // console.log(`before update ${JSON.stringify(categories)}`)
    // console.log(`updated category ${JSON.stringify(updated)}`)
    const index = _.findIndex(allCategories, { id: updated.id })
    categories.splice(index, 1, updated)
    // console.log(`after update ${JSON.stringify(categories)}`)
  } else {
    for (const category of categories) {
      traverseCategoryTree(category, updated.parentId, (parentCategory) => {
        if (!parentCategory.otherCategories) return
        const index = _.findIndex(parentCategory.otherCategories, {
          id: updated.id,
        })
        parentCategory.otherCategories.splice(index, 1, updated)
      })
    }
  }

  return categories
}

function removeCategory(
  allCategories: Array<Category>,
  categoryToRemoved: Category,
) {
  let categories = _.cloneDeep(allCategories)

  if (!categoryToRemoved.parentId) {
    categories = categories.filter(
      (category) => category.id != categoryToRemoved.id,
    )
    if (categoryToRemoved.otherCategories) {
      categories.push(...categoryToRemoved.otherCategories)
    }
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
