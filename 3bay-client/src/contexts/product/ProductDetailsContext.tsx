import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import {
  initialProductState,
  ProductAction,
  ProductReducer,
  ProductState,
} from '../../stores/product/product.store'
import Product from '../../models/product'
import BidderService from '../../services/bidder.service'
import { useAuth } from '../user/AuthContext'

type ProductProviderProps = {
  children: ReactNode
}

type ProductContextType = {
  state: ProductState
  dispatch: Dispatch<ProductAction>
  updateCurrentProduct: (current: Product) => void
}

const ProductDetailsContext = createContext<ProductContextType>({
  state: initialProductState,
  dispatch: () => null,
  updateCurrentProduct(): never {
    throw new Error('Forgot to wrap component in `ProductProvider`')
  },
})

export const useProductContext = (): ProductContextType => {
  return useContext(ProductDetailsContext)
}

const ProductProvider = ({ children }: ProductProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(ProductReducer, initialProductState)
  const { user } = useAuth()

  const updateCurrentProduct = useCallback(
    (current: Product) => {
      dispatch({ type: 'UPDATE_CURRENT_PRODUCT', payload: current })
    },
    [dispatch],
  )

  useEffect(() => {
    ;(async () => {
      if (user && state.currentProduct?.latestAuctionId) {
        try {
          const response = await BidderService.getAuctionStatus(
            user.user,
            state.currentProduct.latestAuctionId,
          )
          dispatch({ type: 'UPDATE_BID_STATUS', payload: response })
        } catch (e) {
          console.log('Cannot update bid status')
          dispatch({ type: 'UPDATE_BID_STATUS' })
        }
      } else {
        dispatch({ type: 'UPDATE_BID_STATUS' })
      }
    })()
  }, [state.currentProduct, user])

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      updateCurrentProduct,
    }),
    [state, updateCurrentProduct],
  )

  return (
    <ProductDetailsContext.Provider value={contextValue}>
      {children}
    </ProductDetailsContext.Provider>
  )
}
export default ProductProvider
