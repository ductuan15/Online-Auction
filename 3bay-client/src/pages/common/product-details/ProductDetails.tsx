import { useEffect } from 'react'
import {Grid, Paper} from '@mui/material'

import ProductImage from '../../../components/common/product/ProductImage'
import ProductInfo from '../../../components/common/product/ProductInfo'
import { getProductById, getTop } from '../../../services/product.service'
import { useParams } from 'react-router-dom'
import ProductCarousel from '../../../components/common/carousel/ProductCarousel'

import ProductDescription from '../../../components/common/product/ProductDesciption'
import './ProductDetails.css'
import { useProductContext } from '../../../contexts/product/ProductContext'

const ProductDetails = (): JSX.Element | null => {
  const { state, dispatch } = useProductContext()
  const { id } = useParams()

  useEffect(() => {
    ;(async () => {

      if (id && +id) {
        const response = await getProductById(+id)
        dispatch({
          type: 'UPDATE_CURRENT_PRODUCT',
          payload: response.data,
        })
      }
    })()
  }, [dispatch, id])

  return state.currentProduct ? (
    <Grid
      container
      xs={12}
      my={1}
      display='flex'
      alignItems='center'
      flexDirection='column'
      rowSpacing={2}
    >
      <Grid
        container
        item
        xs={12}
        alignItems='flex-start'
        rowSpacing={2}
      >
        <Grid item xs={12} md={6} component={Paper} variant='outlined' p={2}>
          <ProductImage product={state.currentProduct} />
        </Grid>

        <Grid container item xs={12} md={6} p={2}>
          <ProductInfo product={state.currentProduct} />
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <ProductDescription product={state.currentProduct} />
      </Grid>

      <ProductCarousel
        name={'Related Products'}
        fetchFunction={getTop.getTopPrice}
        showLoading={true}
      />
    </Grid>
  ) : null
}
export default ProductDetails
