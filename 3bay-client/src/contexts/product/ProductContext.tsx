import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  initialProductState,
  ProductAction,
  ProductReducer,
  ProductState,
} from '../../stores/product/product.store'
import Product from '../../data/product'

type ProductProviderProps = {
  children: ReactNode
}

type ProductContextType = {
  state: ProductState
  dispatch: Dispatch<ProductAction>
  updateCurrentProduct: (current: Product) => void
}

const ProductContext = createContext<ProductContextType>({
  state: initialProductState,
  dispatch: () => null,
  updateCurrentProduct(): never {
    throw new Error('Forgot to wrap component in `ProductProvider`')
  },
})

export const useProductContext = (): ProductContextType => {
  return useContext(ProductContext)
}

const ProductProvider = ({ children }: ProductProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(ProductReducer, initialProductState)

  const updateCurrentProduct = useCallback(
    (current: Product) => {
      dispatch({ type: 'UPDATE_CURRENT_PRODUCT', payload: current })
    },
    [dispatch],
  )

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      updateCurrentProduct,
    }),
    [state, updateCurrentProduct],
  )

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}
export default ProductProvider
