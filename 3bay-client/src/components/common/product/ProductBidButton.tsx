import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import * as React from 'react'
import { useMemo } from 'react'
import { useUserContext } from '../../../contexts/user/UserContext'
import BorderButton from '../button/BorderButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from '@mui/material'

function ProductBidButton(): JSX.Element | null {
  const {
    state: { currentProduct: product, bidStatus },
    dispatch
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
        <BorderButton sx={{ mt: 1 }} color='info'>
          ➕ Increase bid price
        </BorderButton>
      )
      break
    case 'REJECT':
      button = (
        <BorderButton
          color='error'
          isSelected={true}
          disableRipple
          sx={{ mt: 1 }}
        >
          🚫 You are not allowed to bid this product
        </BorderButton>
      )
      break
    default:
      button = (
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
      )
  }
  // seller cannot buy their own product
  if (!canBidThis && userDetails) {
    button = null
  }

  return button
}

export default ProductBidButton 