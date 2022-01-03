import { useEffect, useMemo, useState } from 'react'
import { Grid, Paper, Skeleton, Typography } from '@mui/material'

import ProductImage from '../../../components/common/product/ProductImage'
import ProductInfo from '../../../components/common/product/ProductInfo'
import { getProductById, getTop } from '../../../services/product.service'
import { useParams } from 'react-router-dom'
import ProductCarousel from '../../../components/common/carousel/ProductCarousel'

import ProductDescription from '../../../components/common/product/ProductDesciption'
import './ProductDetails.css'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import ProductInfoSkeleton from '../../../components/common/product/ProductInfoSkeleton'
import { useTitle } from '../../../hooks'
import ProductBidDialog from '../../../components/common/product/ProductBidDialog'
import BidRequestTable from '../../../components/seller/product/BidRequestTable'
import { useAuth } from '../../../contexts/user/AuthContext'

// TODO fetch related products instead of `getTop.getTopPrice`
const ProductDetails = (): JSX.Element | null => {
  const { state, dispatch } = useProductContext()
  const { user } = useAuth()
  const { id } = useParams()
  const [isLoading, setLoading] = useState(true)

  useTitle(`3bay | ${state.currentProduct?.name || ''}`)

  const isProductSeller = useMemo(() => {
    if (user && state.currentProduct?.sellerId) {
      return user?.user === state.currentProduct.sellerId
    }
    return false
  }, [state.currentProduct, user])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (id && +id) {
        const response = await getProductById(+id)
        dispatch({
          type: 'UPDATE_CURRENT_PRODUCT',
          payload: response.data,
        })
      }
      setLoading(false)
    })()
  }, [dispatch, id])

  return (
    <>
      <Grid
        container
        my={1}
        display='flex'
        alignItems='center'
        flexDirection='column'
        rowSpacing={2}
      >
        <Grid container item xs={12} alignItems='flex-start' rowSpacing={2}>
          <Grid item xs={12} md={6} component={Paper} variant='outlined' p={2}>
            {isLoading ? (
              <Skeleton
                variant='rectangular'
                sx={{
                  height: '435px',
                  width: 1,
                }}
              />
            ) : (
              <ProductImage />
            )}
          </Grid>

          <Grid container item xs={12} md={6} p={2}>
            {isLoading ? (
              <ProductInfoSkeleton />
            ) : (
              <>{state.currentProduct && <ProductInfo />}</>
            )}
          </Grid>
        </Grid>

        <Grid item container xs={12}>
          {isLoading ? (
            <Paper
              elevation={0}
              component={Grid}
              container
              item
              variant='outlined'
              flexDirection='row'
              xs={12}
              p={2}
              px={3}
            >
              <Skeleton
                variant='rectangular'
                sx={{
                  height: '435px',
                  width: 1,
                }}
              />
            </Paper>
          ) : (
            <>{state.currentProduct && <ProductDescription />}</>
          )}
        </Grid>

        {isProductSeller && (
          <Grid container item xs={12} mx={3} flexDirection='column'>
            <Typography
              gutterBottom
              variant='h4'
              component='h5'
              color='text.primary'
            >
              Bidders request
            </Typography>

            <Typography
              variant='subtitle1'
              color='text.primary'
              gutterBottom
            >
              These bidders would like to bid your product, you can
              accept/reject their request. <br />
              And remember that, once you reject their requests, they will not be
              able to bid your product.
            </Typography>

            <Grid item xs={12} md={6}>
              <BidRequestTable />
            </Grid>
          </Grid>
        )}
        <ProductCarousel
          name={'Related Products'}
          fetchFunction={getTop.getTopPrice}
          showLoading={true}
        />
      </Grid>

      <ProductBidDialog />
    </>
  )
}
export default ProductDetails
