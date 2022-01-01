import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  Paper,
  Typography,
} from '@mui/material'

import ProductImage from '../../../components/common/product/ProductImage'
import ProductInfo from '../../../components/common/product/ProductInfo'

import ProductProvider from '../../../contexts/product/ProductContext'
import Product from '../../../models/product'
import EditIcon from '@mui/icons-material/Edit'
import moment from 'moment'
import { getProductById, getTop } from '../../../services/product.service'
import { Link as RouterLink, useParams } from 'react-router-dom'
import CarouselCard from '../../../components/common/carousel/Carousel'
import DOMPurify from 'dompurify'

import './ProductDetail.css'
// import StyledDiv from '../../../components/common/StyledDiv'
import { styled } from '@mui/material/styles'

const ProductDetail = (): JSX.Element => {
  return (
    <ProductProvider>
      <ProductDetailContent />
    </ProductProvider>
  )
}
export default ProductDetail

const StyledDiv = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  span: {
    backgroundColor: 'inherit !important',
    color: 'inherit !important',
  },
}))

const ProductDetailContent = (): JSX.Element | null => {
  const [product, setProducts] = useState<Product>()
  const { id } = useParams()

  useEffect(() => {
    ;(async () => {
      // console.log(id)

      if (id && +id) {
        const response = await getProductById(+id)
        setProducts(response.data)
      }
    })()
  }, [id])

  return (
    product ?
    <Grid container display='flex' alignItems='center' flexDirection='column'>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <ProductImage product={product} />
        </Grid>
        <Grid item xs={6}>
          <ProductInfo product={product} />
        </Grid>
      </Grid>

      <CarouselCard
        name={'Related Products'}
        fetchFunction={getTop.getTopPrice}
      />

      <Paper
        elevation={0}
        variant='outlined'
        sx={{
          width: 1,
        }}
      >
        <Divider />
        <Grid container xs={12}>
          <Typography gutterBottom variant='h4' component='h5'>
            About the product
          </Typography>

          <Box flexGrow={1} />

          <Link
            component={RouterLink}
            to={`/product/${product?.id}/edit`}
            underline='none'
            color='inherit'
          >
            <Button>✏️ Add more description</Button>
          </Link>
        </Grid>
        {product
          ? product.productDescriptionHistory.map(function (des) {
              return (
                <Grid key={des.id}>
                  <Typography variant='body1' color='text.primary'>
                    <EditIcon />
                    <span>{moment(des.createdAt).format('L')}</span>
                  </Typography>

                  <StyledDiv
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(des.description),
                    }}
                  />
                </Grid>
              )
            })
          : null}
      </Paper>
    </Grid> : null
  )
}
