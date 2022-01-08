import Grid from '@mui/material/Grid'
import * as React from 'react'
import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Product from '../../../models/product'
import UserService from '../../../services/user.service'
import ProductItem from '../../../components/common/product/ProductItem'

const WonAuctionListPage = (): JSX.Element => {
  const [wonAuctionList, setWonAuctionList] = useState<Product[]>([])
  useEffect(() => {
    ;(async () => {
      const wonAuctionList = await UserService.getUserWonAuctionList()
      setWonAuctionList(wonAuctionList)
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
      {wonAuctionList.length > 0 ? (
        wonAuctionList.map((product, index) => {
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
            You haven&apos;t won any auctions. Please return to home page to bid
            & get your favorite products
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
export default WonAuctionListPage
