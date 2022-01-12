import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import * as React from 'react'
import { useMemo } from 'react'
import { useUserContext } from '../../../contexts/user/UserContext'
import BorderButton from '../button/BorderButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'
import moment from 'moment'
import { BidStatus } from '../../../models/bidder'
import auctionService from "../../../services/auction.service";

const RejectButton = (
  <BorderButton color='error' isSelected={true} disableRipple sx={{ mt: 1 }}>
    🚫 You are not allowed to bid this product
  </BorderButton>
)

const MINIMUM_POINT = 0.8

function ProductBidButton(): JSX.Element | null {
  const {
    state: { currentProduct: product, bidStatus, userPoint, latestAuction },
    dispatch,
  } = useProductContext()

  const {
    state: { userDetails },
  } = useUserContext()

  const navigate = useNavigate()
  const location = useLocation()

  const canBidThis = useMemo(() => {
    return userDetails && product?.sellerId !== userDetails?.uuid
  }, [product?.sellerId, userDetails])

  let button: JSX.Element | null

  const closeTimeStr = latestAuction?.closeTime || null
  const closeTime = closeTimeStr ? moment(new Date(closeTimeStr)) : null

  const onCancelTransactionButtonClicked = async () => {
    if (product) {
      if (latestAuction?.sellerComment !== "The winner didn't pay the order" && latestAuction?.sellerReview !== false) {    //if the seller haven't cancel the transaction before
        const payload = {
          sellerComment: "The winner didn't pay the order",
          sellerReview: false,
        }
        await auctionService.addSellerReview(product.id, payload)
      }
    }
  }

  if (!userPoint || (userPoint && userPoint >= MINIMUM_POINT)) {
    switch (bidStatus?.status) {
      case 'NOT_BID':
        button = (
          <BorderButton
            color='success'
            sx={{ mt: 1 }}
            onClick={() => {
              dispatch({ type: 'OPEN_BID_DIALOG' })
            }}
          >
            💰 Bid this product
          </BorderButton>
        )
        break
      case 'PENDING':
        button = (
          <BorderButton
            color='warning'
            isSelected={true}
            disableRipple
            sx={{ mt: 1 }}
          >
            ⏳ Waiting for seller response
          </BorderButton>
        )
        break
      case 'ACCEPT':
        button = (
          <BorderButton
            sx={{ mt: 1 }}
            color='info'
            onClick={() => {
              dispatch({ type: 'OPEN_BID_DIALOG' })
            }}
          >
            ➕ Increase bid price
          </BorderButton>
        )
        break
      case 'REJECT':
        button = RejectButton
        break
      default:
        button = !userDetails ? (
          <Link
            underline='none'
            color='inherit'
            onClick={() => {
              navigate('/signin', {
                state: {
                  from: location,
                },
              })
            }}
          >
            <BorderButton color='warning' sx={{ mt: 1 }}>
              Sign in to bid the product
            </BorderButton>
          </Link>
        ) : null
    }
  } else {
    button = RejectButton
  }

  // seller cannot buy their own product
  if (!canBidThis && userDetails) {
    button = null
  }

  // seller can cancel the transaction when auction had winner
  if (!canBidThis && userDetails && latestAuction) {
    if (closeTime?.isBefore() && latestAuction.winningBid && latestAuction.sellerComment !== "The winner didn't pay the order" && latestAuction.sellerReview !== false) {      //closeTime < now => end auction && winningBid && review are not cancel
      button = (
        <BorderButton
          sx={{ mt: 1 }}
          color='error'
          onClick={onCancelTransactionButtonClicked}
        >
          ❌ Cancel the transaction
        </BorderButton>
      )
    }
  }

  return button
}

export default ProductBidButton
