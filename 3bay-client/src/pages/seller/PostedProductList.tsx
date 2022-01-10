import * as React from 'react'
import { useEffect, useState } from 'react'
import Product from '../../models/product'
import sellerService from '../../services/seller.service'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ProductListLayout from '../../components/common/product/ProductListLayout'
import { useTitle } from '../../hooks'

const PostedProductListPage = (): JSX.Element => {
  useTitle('3bay | Posted products')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async function getPostedProduct() {
      const res = await sellerService.getAllPostedProduct()
      setProducts(res.data)
      setIsLoading(false)
    })()
  }, [])

  return (
    <ProductListLayout
      items={products}
      isLoading={isLoading}
      emptyListComponent={
        <Grid item xs={12}>
          <Typography variant='h1' color='text.primary' align='center'>
            📦
          </Typography>

          <Typography
            pt={2}
            gutterBottom
            variant='h6'
            color='text.primary'
            align='center'
          >
            You haven&apos;t posted any products.
          </Typography>
        </Grid>
      }
      titleComponent={'Posted products'}
    />
  )
}
export default PostedProductListPage
