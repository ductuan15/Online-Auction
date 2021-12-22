// import _ from 'lodash'
import Product from '../../data/product'

export type ProductState = {
  // allCategories: Array<ProductDetail>
  currentProduct?: Product
}

export type ProductAction =
  // | { type: 'ADD_ALL'; payload: Array<ProductDetail> }
  // | { type: 'ADD'; payload: ProductDetail }
  // | { type: 'UPDATE'; payload: { current: ProductDetail; updated: ProductDetail } }
  // | { type: 'REMOVE'; payload: ProductDetail }
  // | { type: 'OPEN_CREATE_DIALOG'; payload: boolean }
  // | { type: 'OPEN_EDIT_DIALOG'; payload: boolean }
  // | { type: 'CLOSE_ALL_DIALOGS' }
  { type: 'UPDATE_CURRENT_PRODUCT'; payload: Product }

export const initialProductState: ProductState = {
  // allCategories: [],
  currentProduct: undefined,
}

export const ProductReducer = (
  state: ProductState,
  action: ProductAction,
): ProductState => {
  switch (action.type) {
    // case 'ADD_ALL':
    //     return {
    //         ...state,
    //         allCategories: action.payload,
    //     }
    // case 'ADD':
    //     return {
    //         ...state,
    //     }
    // case 'UPDATE': {
    //     return {
    //         ...state,
    //     }
    // }
    // case 'REMOVE':
    //     return {
    //         ...state,
    //     }
    case 'UPDATE_CURRENT_PRODUCT':
      return {
        ...state,
        currentProduct: action.payload,
      }
    default:
      return state
  }
}

// function addNewCategory(
//     allCategories: Array<Category>,
//     newCategory: Category,
// ): Array<Category> {
//     if (!newCategory.parentId) {
//         return [...allCategories, newCategory]
//     }
//
//     const categories = _.cloneDeep(allCategories)
//
//     for (const category of categories) {
//         traverseCategoryTree(category, newCategory.parentId, (parentCategory) => {
//             if (!parentCategory.otherCategories) {
//                 parentCategory.otherCategories = [newCategory]
//             } else {
//                 parentCategory.otherCategories?.push(newCategory)
//             }
//         })
//     }
//     return categories
// }
//
// function updateCategory(
//     allCategories: Array<Category>,
//     current: Category,
//     updated: Category,
// ) {
//     if (current.parentId !== updated.parentId) {
//         const cats = removeCategory(allCategories, current)
//         return addNewCategory(cats, updated)
//     }
//
//     const categories = _.cloneDeep(allCategories)
//
//     if (!updated.parentId) {
//         // console.log(`before update ${JSON.stringify(categories)}`)
//         // console.log(`updated category ${JSON.stringify(updated)}`)
//         const index = _.findIndex(allCategories, { id: updated.id })
//         categories.splice(index, 1, updated)
//         // console.log(`after update ${JSON.stringify(categories)}`)
//     } else {
//         for (const category of categories) {
//             traverseCategoryTree(category, updated.parentId, (parentCategory) => {
//                 if (!parentCategory.otherCategories) return
//                 const index = _.findIndex(parentCategory.otherCategories, {
//                     id: updated.id,
//                 })
//                 parentCategory.otherCategories.splice(index, 1, updated)
//             })
//         }
//     }
//
//     return categories
// }
//
// function removeCategory(
//     allCategories: Array<Category>,
//     categoryToRemoved: Category,
// ) {
//     let categories = _.cloneDeep(allCategories)
//
//     if (!categoryToRemoved.parentId) {
//         categories = categories.filter(
//             (category) => category.id !== categoryToRemoved.id,
//         )
//         if (categoryToRemoved.otherCategories) {
//             categoryToRemoved.otherCategories.forEach((cat) => {
//                 cat.parentId = undefined
//             })
//             categories.push(...categoryToRemoved.otherCategories)
//         }
//     } else {
//         for (const category of categories) {
//             traverseCategoryTree(
//                 category,
//                 categoryToRemoved.parentId,
//                 (parentCategory) => {
//                     if (!parentCategory.otherCategories) return
//
//                     parentCategory.otherCategories =
//                         parentCategory.otherCategories.filter(
//                             (category) => category.id !== categoryToRemoved.id,
//                         )
//
//                     if (categoryToRemoved.otherCategories) {
//                         categoryToRemoved.otherCategories.forEach((cat) => {
//                             cat.parentId = parentCategory.id
//                         })
//                         parentCategory.otherCategories.push(...categoryToRemoved.otherCategories)
//                     }
//                 },
//             )
//         }
//     }
//
//     return categories
// }
//
// function traverseCategoryTree(
//     category: Category,
//     id: number,
//     cb: (category: Category) => void,
// ) {
//     if (category.id === id) {
//         cb(category)
//     } else if (category.otherCategories) {
//         for (const subCategory of category.otherCategories) {
//             traverseCategoryTree(subCategory, id, cb)
//         }
//     }
// }
