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
import useSocketContext, { SocketEvent } from '../socket/SocketContext'
import { Auction } from '../../models/auctions'

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
  const { socket } = useSocketContext()

  const updateCurrentProduct = useCallback(
    (current: Product) => {
      dispatch({ type: 'UPDATE_CURRENT_PRODUCT', payload: current })
    },
    [dispatch],
  )

  // get user's point
  useEffect(() => {
    ;(async () => {
      if (user && state.latestAuction?.id) {
        try {
          const point = await UserService.getPoint(user.user)
          dispatch({ type: 'UPDATE_USER_POINT', payload: point })

          const response = await BidderService.getAuctionStatus(
            state.latestAuction?.id,
          )
          dispatch({ type: 'UPDATE_BID_STATUS', payload: response })

          return
        } catch (e) {
          // console.log('Cannot update bid status')
        }
        dispatch({ type: 'UPDATE_BID_STATUS' })
        dispatch({ type: 'UPDATE_USER_POINT' })
      }
    })()
  }, [state.latestAuction, user])

  // get seller's point
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

  // get user's bid status
  useEffect(() => {
    ;(async () => {
      try {
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

      dispatch({ type: 'UPDATE_WINNING_BIDDER_POINT' })
    })()
  }, [state.latestAuction?.winningBid])

  useEffect(() => {
    socket?.on(SocketEvent.AUCTION_UPDATE, (data: Auction) => {
      // console.log(data)
      if (state.currentProduct?.latestAuctionId === data.id) {
        dispatch({ type: 'UPDATE_AUCTION', payload: data })
      }
    })

    if (state.currentProduct?.latestAuctionId) {
      // console.log(`subscribe to ${state.latestAuction.id}`)
      socket?.emit(
        SocketEvent.SUBSCRIBE_AUCTION,
        state.currentProduct?.latestAuctionId,
      )
    }

    return () => {
      socket?.emit(SocketEvent.SUBSCRIBE_AUCTION, undefined)
      socket?.off(SocketEvent.AUCTION_UPDATE)
    }
  }, [socket, state.currentProduct?.latestAuctionId])

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
