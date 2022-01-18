import Grid from '@mui/material/Grid'
import * as React from 'react'
import {useEffect, useState} from 'react'
import Typography from '@mui/material/Typography'
import UserService from '../../../services/user.service'
import Product from '../../../models/product'
import ProductListLayout from '../../../components/common/product-list/ProductListLayout'
import {useTitle} from '../../../hooks'

const AuctionListPage = (): JSX.Element => {
  useTitle('3bay | Auction list')
  const [auctionList, setAuctionList] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const auctionList = await UserService.getUserAuctionList()
      setAuctionList(auctionList)
      setIsLoading(false)
    })()
  }, [])

  return (
    <ProductListLayout
      items={auctionList}
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
      titleComponent={'Auction list'}
    />
  )
}
export default AuctionListPage
