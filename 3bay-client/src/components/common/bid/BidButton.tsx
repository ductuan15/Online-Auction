import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { useUserContext } from '../../../contexts/user/UserContext'
import BorderButton from '../button/BorderButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link, Stack } from '@mui/material'
import moment from 'moment'
import auctionService from '../../../services/auction.service'
import BidderService from '../../../services/bidder.service'

const RejectButton = (
  <BorderButton color='error' isSelected={true} disableRipple sx={{ mt: 1 }}>
    🚫 You are not allowed to bid this product
  </BorderButton>
)

const MINIMUM_POINT = 0.8
const TRANSACTION_REJECT_COMMENT = "The winner didn't pay the order"

function BidButton(): JSX.Element | null {
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

  const hasSellerComment = useMemo(() => {
    return (
      latestAuction &&
      (latestAuction.sellerComment !== null ||
        latestAuction.sellerReview !== null)
    )
  }, [latestAuction])

  const onCancelTransactionButtonClicked = useCallback(async () => {
    if (product?.id && !hasRejectComment) {
      const payload = {
        sellerComment: TRANSACTION_REJECT_COMMENT,
        sellerReview: false,
      }
      await auctionService.addSellerReview(product?.id, payload)
    }
  }, [hasRejectComment, product?.id])

  const onCancelAutoBidButtonClicked = useCallback(async () => {
    if (latestAuction?.id) {
      try {
        const bidStatus = await auctionService.removeAutoBid(latestAuction?.id)
        // console.log(bidStatus)
        dispatch({ type: 'UPDATE_BID_STATUS', payload: bidStatus })
      } catch (e) {
        //
      }
    }
  }, [dispatch, latestAuction?.id])

  const requestBidPermission = useCallback(async () => {
    if (latestAuction?.id && userDetails?.uuid) {
      const response = await BidderService.requestBidPermission(
        latestAuction?.id,
      )
      dispatch({ type: 'UPDATE_BID_STATUS', payload: response })
    }
  }, [dispatch, latestAuction?.id, userDetails?.uuid])

  return useMemo(() => {
    let button: JSX.Element | null
    if (!userPoint || (userPoint && userPoint >= MINIMUM_POINT)) {
      switch (bidStatus?.status) {
        case 'NOT_BID': {
          if (userPoint) {
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
          } else {
            button = (
              <BorderButton
                color='info'
                sx={{ mt: 1 }}
                onClick={requestBidPermission}
              >
                🙏 Request bid permission
              </BorderButton>
            )
          }
          break
        }
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
            <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
              <BorderButton
                color='info'
                onClick={() => {
                  dispatch({ type: 'OPEN_BID_DIALOG' })
                }}
              >
                ➕ Increase bid price
              </BorderButton>

              {bidStatus?.hasAutoBid && (
                <BorderButton
                  color='error'
                  onClick={onCancelAutoBidButtonClicked}
                >
                  ❌ Cancel automatic bidding
                </BorderButton>
              )}
            </Stack>
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
      !hasSellerComment &&
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
    bidStatus?.hasAutoBid,
    bidStatus?.status,
    canBidThis,
    closeTime,
    dispatch,
    hasSellerComment,
    latestAuction?.closeTime,
    latestAuction?.winningBid,
    location,
    navigate,
    onCancelAutoBidButtonClicked,
    onCancelTransactionButtonClicked,
    product?.sellerId,
    requestBidPermission,
    userDetails,
    userPoint,
  ])
}

export default BidButton
