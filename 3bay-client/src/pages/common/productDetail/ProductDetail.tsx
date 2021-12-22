import * as React from 'react'
import { useEffect } from 'react'
import { Divider, Grid, Paper, Typography } from '@mui/material'
import CarouselCard from '../../../components/common/Carousel'

import ProductImage from '../../../components/common/product/ProductImage'
import ProductInfo from '../../../components/common/product/ProductInfo'

import {
  ProductProvider,
  useProductContext,
} from '../../../contexts/product/ProductContext'
import axiosApiInstance from '../../../services/api'
import Product from '../../../data/product'
import EditIcon from '@mui/icons-material/Edit'
import moment from 'moment'

const ProductDetail = (): JSX.Element => {
  return (
    <ProductProvider>
      <ProductDetailContent />
    </ProductProvider>
  )
}
export default ProductDetail

const ProductDetailContent = (): JSX.Element | null => {
  // const productId = props.match.params.productId                                               //get productId

  const { updateCurrentProduct } = useProductContext()
  const { state } = useProductContext()

  useEffect(() => {
    ;(async function loadProduct() {
      try {
        const response = await axiosApiInstance.get(
          '/api/product/1?isWithDescription=true',
        )
        if (response.data) {
          console.log(new Product(response.data))
          updateCurrentProduct(response.data as Product)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

  return (
    <Grid container display='flex' alignItems='center' flexDirection='column'>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <ProductImage product={state.currentProduct} />
        </Grid>
        <Grid item xs={6}>
          <ProductInfo product={state.currentProduct} />
        </Grid>
      </Grid>

      <CarouselCard name={'Sản phẩm tương tự'} />

      <Paper
        elevation={0}
        variant='outlined'
        sx={{
          width: 1,
        }}
      >
        <Divider />
        <Typography gutterBottom variant='h4' component='h5'>
          Mô tả sản phẩm
        </Typography>
        {
          state.currentProduct ?
          state.currentProduct.productDescriptionHistory
            .map(function (des) {
              return (
                <Grid key={des.id}>
                  <Typography variant='body1' color='text.primary'>
                    <EditIcon />
                    <span>{moment(des.time).format('DD/MM/YYYY')}</span>
                  </Typography>
                  <Typography variant='body1' color='text.primary' component={"div"}>
                    - {des.description}
                  </Typography>
                </Grid>
              )
            })
            : null
        }
      </Paper>
    </Grid>
  )
}
