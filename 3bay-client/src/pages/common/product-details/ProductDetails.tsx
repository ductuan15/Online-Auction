import { useEffect, useState } from 'react'
import { Grid, Paper, Skeleton } from '@mui/material'

import ProductImage from '../../../components/common/product/ProductImage'
import ProductInfo from '../../../components/common/product/ProductInfo'
import { getProductById, getTop } from '../../../services/product.service'
import { useParams } from 'react-router-dom'
import ProductCarousel from '../../../components/common/carousel/ProductCarousel'

import ProductDescription from '../../../components/common/product/ProductDesciption'
import './ProductDetails.css'
import { useProductContext } from '../../../contexts/product/ProductContext'
import ProductInfoSkeleton from '../../../components/common/product/ProductInfoSkeleton'

// TODO fetch related products instead of `getTop.getTopPrice`
const ProductDetails = (): JSX.Element | null => {
  const { state, dispatch } = useProductContext()
  const { id } = useParams()
  const [isLoading, setLoading] = useState(true)

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
            <ProductImage product={state.currentProduct} />
          )}
        </Grid>

        <Grid container item xs={12} md={6} p={2}>
          {isLoading ? (
            <ProductInfoSkeleton />
          ) : (
            <>
              {state.currentProduct && (
                <ProductInfo product={state.currentProduct} />
              )}
            </>
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
          <>
            {state.currentProduct && (
              <ProductDescription product={state.currentProduct} />
            )}
          </>
        )}
      </Grid>

      <ProductCarousel
        name={'Related Products'}
        fetchFunction={getTop.getTopPrice}
        showLoading={true}
      />
    </Grid>
  )
}
export default ProductDetails
