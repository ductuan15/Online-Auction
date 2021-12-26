import { useEffect, useState } from 'react'
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
import { getProductById } from '../../../services/product.service'
import { useParams } from 'react-router-dom'

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

  const [product, setProducts] = useState<Product>()
  const { id } = useParams()
  const fetchProduct = async () => {
    console.log(id)

    if (id && +id) {
      const response = await getProductById(+id)
      setProducts(response.data)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])
  return (
    <Grid container display='flex' alignItems='center' flexDirection='column'>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <ProductImage product={product} />
        </Grid>
        <Grid item xs={6}>
          <ProductInfo product={product} />
        </Grid>
      </Grid>

      {/* <CarouselCard name={'Sản phẩm tương tự'} fetchFunction={getTop.getTopPrice}/> */}

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
        {product ?
          product.productDescriptionHistory.map(function (des) {
            return (
              <Grid key={des.id}>
                <Typography variant='body1' color='text.primary'>
                  <EditIcon />
                  <span>{moment(des.createdAt).format('DD/MM/YYYY')}</span>
                </Typography>
                <Typography
                  variant='body1'
                  color='text.primary'
                  component={'div'}
                >
                  - {des.description}
                </Typography>
              </Grid>
            )
          }) : null}
      </Paper>
    </Grid>
  )
}
