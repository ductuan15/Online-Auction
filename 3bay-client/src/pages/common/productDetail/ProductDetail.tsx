import * as React from 'react'
import {useEffect, useState} from 'react'
import { Divider, Grid, Typography } from '@mui/material'
import CarouselCard from '../../../components/common/Carousel'

import ProductImage from '../../../components/common/product/ProductImage'
import ProductInfo from '../../../components/common/product/ProductInfo'

import {
  ProductProvider,
  useProductContext,
} from '../../../contexts/product/ProductContext'
import axiosApiInstance from '../../../services/api'
import Product from '../../../data/product'
import EditIcon from '@mui/icons-material/Edit';
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

  const { updateCurrentProduct, dispatch } = useProductContext()
  const { state } = useProductContext()
  const [description, setDescription] = useState('')


  useEffect(() => {
    (async function loadProduct() {
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

  // useEffect(() => {
  //   // console.log(product?.detail)    //log ra undefined => ch có product => làm sao để gọi api xong mới render mn và vì sao Info có product còn bên đây thì ko dù cả 2 render cùng lúc?
  //   if(state.currentProduct?.productDescriptionHistory) {
  //     const des = ""
  //   }
  //
  //
  //   // console.log(images)
  //   // setImages(images)
  // }, [state.currentProduct])

  // const product = state.currentProduct
  // console.log(product)

  return  (
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

      <Grid
        container
        marginTop={1}
        marginBottom={4}
        spacing={4}
        justifyContent='between'
      >
        <Divider />
        <Typography gutterBottom variant='h4' component='h5'>
          Mô tả sản phẩm
        </Typography>
        <Typography variant='body1' color='text.secondary'>

        </Typography>
      </Grid>
    </Grid>
  )
}
