import * as React from 'react'
import {useEffect, useState} from "react";
import Product from '../../models/product'
import sellerService from "../../services/seller.service";
import Grid from "@mui/material/Grid";
import ProductCard from "../../components/common/product/ProductCard";
import Typography from "@mui/material/Typography";

const PostedProductListPage = (): JSX.Element => {

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function getPostedProduct () {
      const res = await sellerService.getAllPostedProduct()
      setProducts(res.data)
    }
    getPostedProduct()
  }, [])
  
  return (
    <Grid
      container
      display='flex'
      alignItems='center'
      flexDirection='row'
      spacing={{ xs: 2, md: 3, lg: 2 }}
    >
      {products.length > 0 ? (
        products.map((product, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ProductCard product={product} />
            </Grid>
          )
        })
      ) : (
        <Grid item xs={12}>
          <Typography variant='h1' color='text.primary' align='center'>
            ❤️
          </Typography>

          <Typography
            pt={2}
            gutterBottom
            variant='h6'
            color='text.primary'
            align='center'
          >
            You don&apos;t have any products in watch list. Please return to
            home page to search your favorite products
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
export default PostedProductListPage
