import Grid from '@mui/material/Grid'
import * as React from 'react'
import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import UserService from '../../../services/user.service'
import Product from '../../../models/product'
import ProductItem from '../../../components/common/product/ProductItem'

const AuctionListPage = (): JSX.Element => {
  const [auctionList, setAuctionList] = useState<Product[]>([])
  useEffect(() => {
    ;(async () => {
      const auctionList = await UserService.getUserAuctionList()
      setAuctionList(auctionList)
    })()
  }, [])

  return (
    <Grid
      container
      display='flex'
      alignItems='center'
      flexDirection='row'
      spacing={{ xs: 2, md: 3, lg: 2 }}
    >
      {auctionList.length > 0 ? (
        auctionList.map((product, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ProductItem product={product} />
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
            You don&apos;t have any products in auction list. Please return to
            home page to search & bid your favorite products
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
export default AuctionListPage
