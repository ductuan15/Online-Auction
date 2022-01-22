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
import UserService from '../../services/user.service'
import useSocketContext, {SocketEvent} from '../socket/SocketContext'

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
  const {socket} = useSocketContext()

  const updateCurrentProduct = useCallback(
    (current: Product) => {
      dispatch({ type: 'UPDATE_CURRENT_PRODUCT', payload: current })
    },
    [dispatch],
  )

  useEffect(() => {
    ;(async () => {
      if (user && state.latestAuction?.id) {
        try {
          const point = await UserService.getPoint(user.user)
          dispatch({ type: 'UPDATE_USER_POINT', payload: point })

          return
        } catch (e) {
          // console.log('Cannot update bid status')
        }

        dispatch({ type: 'UPDATE_USER_POINT' })
      }
    })()
  }, [state.latestAuction, user])

  useEffect(() => {
    ;(async () => {
      if (state.currentProduct) {
        try {
          const sellerPoint = await UserService.getPoint(
            state.currentProduct?.sellerId,
          )
          dispatch({ type: 'UPDATE_SELLER_POINT', payload: sellerPoint })
          return
        } catch (e) {
          //
        }
        dispatch({ type: 'UPDATE_SELLER_POINT' })
      }
    })()
  }, [state.currentProduct])

  useEffect(() => {
    ;(async () => {
      if (state.latestAuction) {
        try {
          const response = await BidderService.getAuctionStatus(
            state.latestAuction?.id,
          )
          dispatch({ type: 'UPDATE_BID_STATUS', payload: response })

          if (state.latestAuction?.winningBid) {
            const winningBidderPoint = await UserService.getPoint(
              state.latestAuction?.winningBid?.bidderId || '0',
            )
            dispatch({
              type: 'UPDATE_WINNING_BIDDER_POINT',
              payload: winningBidderPoint,
            })
          }

          return
        } catch (e) {
          //
        }
        dispatch({ type: 'UPDATE_BID_STATUS' })
        dispatch({ type: 'UPDATE_WINNING_BIDDER_POINT' })
      }
    })()
  }, [state.latestAuction])

  useEffect(() => {
    if (state.latestAuction?.id) {
      // console.log(`subscribe to ${state.latestAuction.id}`)
      socket?.emit(SocketEvent.SUBSCRIBE_AUCTION, state.latestAuction.id)
    }
    return () => {
      socket?.emit(SocketEvent.SUBSCRIBE_AUCTION, undefined)
    }
  }, [socket, state.latestAuction?.id])

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
