import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  ProductAction,
  ProductReducer,
  ProductState,
  initialProductState,
} from '../../stores/product/product.store'
import Product from '../../data/product'

type ProductProviderProps = {
  children: ReactNode
}

type ProductContextType = {
  state: ProductState
  dispatch: Dispatch<ProductAction>
  // addAllCategories: (categories: Array<ProductDetail>) => void
  // addProduct: (ProductDetail: ProductDetail) => void
  // removeProduct: (ProductDetail: ProductDetail) => void
  // updateProduct: (current: ProductDetail, updated: ProductDetail) => void
  updateCurrentProduct: (current: Product) => void
}

const ProductContext = createContext<ProductContextType>({
  state: initialProductState,
  dispatch: () => null,
  // addAllCategories(): never {
  //     throw new Error('Forgot to wrap component in `ProductProvider`')
  // },
  // addProduct(): never {
  //     throw new Error('Forgot to wrap component in `ProductProvider`')
  // },
  // removeProduct(): never {
  //     throw new Error('Forgot to wrap component in `ProductProvider`')
  // },
  // updateProduct(): never {
  //     throw new Error('Forgot to wrap component in `ProductProvider`')
  // },
  updateCurrentProduct(): never {
    throw new Error('Forgot to wrap component in `ProductProvider`')
  },
})

export const useProductContext = (): ProductContextType => {
  return useContext(ProductContext)
}

export const ProductProvider = ({
  children,
}: ProductProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(ProductReducer, initialProductState)

  // const addAllCategories = (categories: Array<ProductDetail>) => {
  //     //console.log(categories)
  //     dispatch({ type: 'ADD_ALL', payload: categories })
  // }
  // const addProduct = (ProductDetail: ProductDetail) => {
  //     dispatch({ type: 'ADD', payload: ProductDetail })
  // }
  // const removeProduct = (ProductDetail: ProductDetail) => {
  //     dispatch({ type: 'REMOVE', payload: ProductDetail })
  // }
  // const updateProduct = (current: ProductDetail, updated: ProductDetail) => {
  //     dispatch({ type: 'UPDATE', payload: { current, updated } })
  // }
  const updateCurrentProduct = (current: Product) => {
    dispatch({ type: 'UPDATE_CURRENT_PRODUCT', payload: current })
  }
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      // addAllCategories,
      // addProduct,
      // removeProduct,
      // updateProduct,
      updateCurrentProduct,
    }),
    [state, dispatch],
  )

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}
export default {}
