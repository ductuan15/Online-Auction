import Grid from '@mui/material/Grid'
import * as React from 'react'
import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Product from '../../../models/product'
import UserService from '../../../services/user.service'
import ProductListLayout from '../../../components/common/product/ProductListLayout'
import { useTitle } from '../../../hooks'

const WonAuctionListPage = (): JSX.Element => {
  useTitle('3bay | Won auctions')
  const [wonAuctionList, setWonAuctionList] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const wonAuctionList = await UserService.getUserWonAuctionList()
      setWonAuctionList(wonAuctionList)
      setIsLoading(false)
    })()
  }, [])

  return (
    <ProductListLayout
      items={wonAuctionList}
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
            You haven&apos;t won any auctions. Please return to home page to bid
            & get your favorite products
          </Typography>
        </Grid>
      }
      titleComponent={'Won auctions'}
    />
  )
}
export default WonAuctionListPage
