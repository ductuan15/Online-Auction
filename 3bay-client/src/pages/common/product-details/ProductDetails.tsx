import { useEffect, useMemo, useState } from 'react'
import { Grid, Paper, Skeleton } from '@mui/material'

import ProductImage from '../../../components/common/product/ProductImage'
import ProductInfo from '../../../components/common/product/ProductInfo'
import {
  getProductById,
  getRelativeProductsFunction,
} from '../../../services/product.service'
import { useParams } from 'react-router-dom'
import ProductCarousel from '../../../components/common/carousel/ProductCarousel'

import ProductDescription from '../../../components/common/product/ProductDesciption'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import ProductInfoSkeleton from '../../../components/common/product/ProductInfoSkeleton'
import { useTitle } from '../../../hooks'
import BidDialog from '../../../components/common/bid/BidDialog'
import BidRequestTable from '../../../components/seller/product/BidRequestTable'
import { useAuth } from '../../../contexts/user/AuthContext'
import BidHistoryTable from '../../../components/common/bid/BidHistoryTable'
import ProductComment from '../../../components/common/product-card/ProductComment'
import Error404 from '../error/Error404'

const ProductDetails = (): JSX.Element | null => {
  const { state, dispatch } = useProductContext()
  const { user } = useAuth()
  const { id } = useParams()
  const [isLoading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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
        dispatch({
          type: 'UPDATE_BID_STATUS',
        })
        try {
          const response = await getProductById(+id)
          // console.log(response.data)
          dispatch({
            type: 'UPDATE_CURRENT_PRODUCT',
            payload: response.data,
          })
        } catch (e) {
          setNotFound(true)
        }
      }
      setLoading(false)
    })()
  }, [dispatch, id])

  return notFound ? (
    <Error404 />
  ) : (
    <>
      <Grid
        container
        my={1}
        display='flex'
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

        {isProductSeller && <BidRequestTable />}

        <BidHistoryTable />

        <ProductComment />

        <>
          {!isLoading
            ? state.currentProduct && (
                <ProductCarousel
                  name={'Related Products'}
                  fetchFunction={getRelativeProductsFunction(
                    +state.currentProduct.category.id,
                    state.currentProduct.id,
                  )}
                  showLoading={true}
                />
              )
            : null}
        </>
      </Grid>

      <BidDialog />
    </>
  )
}
export default ProductDetails
