import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { useUserContext } from '../../../contexts/user/UserContext'
import BorderButton from '../button/BorderButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'
import moment from 'moment'
import auctionService from '../../../services/auction.service'

const RejectButton = (
  <BorderButton color='error' isSelected={true} disableRipple sx={{ mt: 1 }}>
    🚫 You are not allowed to bid this product
  </BorderButton>
)

const MINIMUM_POINT = 0.8
const TRANSACTION_REJECT_COMMENT = "The winner didn't pay the order"

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
  const closeTime = useMemo(() => {
    if (latestAuction?.closeTime) {
      return moment(latestAuction?.closeTime)
    }
    return null
  }, [latestAuction?.closeTime])

  const canBidThis = useMemo(() => {
    return product?.sellerId !== userDetails?.uuid && closeTime?.isAfter()
  }, [closeTime, product?.sellerId, userDetails?.uuid])

  const hasRejectComment = useMemo(() => {
    return (
      latestAuction?.sellerComment === TRANSACTION_REJECT_COMMENT &&
      latestAuction?.sellerReview === false
    )
  }, [latestAuction?.sellerComment, latestAuction?.sellerReview])

  const onCancelTransactionButtonClicked = useCallback(async () => {
    if (product?.id && !hasRejectComment) {
      const payload = {
        sellerComment: TRANSACTION_REJECT_COMMENT,
        sellerReview: false,
      }
      await auctionService.addSellerReview(product?.id, payload)
    }
  }, [hasRejectComment, product?.id])

  return useMemo(() => {
    let button: JSX.Element | null
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
    if (
      product?.sellerId === userDetails?.uuid &&
      latestAuction?.closeTime &&
      latestAuction?.winningBid &&
      !hasRejectComment &&
      closeTime?.isBefore()
    ) {
      //closeTime < now => end auction && winningBid
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

    return button
  }, [
    bidStatus?.status,
    canBidThis,
    closeTime,
    dispatch,
    hasRejectComment,
    latestAuction?.closeTime,
    latestAuction?.winningBid,
    location,
    navigate,
    onCancelTransactionButtonClicked,
    product?.sellerId,
    userDetails,
    userPoint,
  ])
}

export default ProductBidButton
