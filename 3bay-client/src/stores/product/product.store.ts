import _ from 'lodash'
import Product from "../../data/product";

export type ProductState = {
    allCategories: Array<Product>
    currentProduct?: Product
}

export type ProductAction =
    | { type: 'ADD_ALL'; payload: Array<Product> }
    | { type: 'ADD'; payload: Product }
    | { type: 'UPDATE'; payload: { current: Product; updated: Product } }
    | { type: 'REMOVE'; payload: Product }
    | { type: 'OPEN_CREATE_DIALOG'; payload: boolean }
    | { type: 'OPEN_EDIT_DIALOG'; payload: boolean }
    | { type: 'CLOSE_ALL_DIALOGS' }
    | { type: 'CURRENT_Product'; payload: Product | undefined }

export const initialProductState: ProductState = {
    allCategories: [],
    currentProduct: undefined,
}

export const ProductReducer = (
    state: ProductState,
    action: ProductAction,
): ProductState => {
    switch (action.type) {
        case 'ADD_ALL':
            return {
                ...state,
                allCategories: action.payload,
            }
        case 'ADD':
            return {
                ...state,
            }
        case 'UPDATE': {
            return {
                ...state,
            }
        }
        case 'REMOVE':
            return {
                ...state,
            }
        case 'CURRENT_Product':
            return {
                ...state,
                currentProduct: action.payload,
            }
        default:
            return state
    }
}