import Grid from '@mui/material/Grid'
import ProductCard from '../../../components/common/product/ProductCard'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import { useUserContext } from '../../../contexts/user/UserContext'

const WonAuctionListPage = (): JSX.Element => {
  const {
    state: { wonauctionlist },
  } = useUserContext()

  return (
    <Grid
      container
      display='flex'
      alignItems='center'
      flexDirection='row'
      spacing={{ xs: 2, md: 3, lg: 2 }}
    >
      {wonauctionlist.length > 0 ? (
        wonauctionlist.map((product, index) => {
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
            You don&apos;t have any won products in auction list. Please return to
            home page to bid & get your favorite products
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
export default WonAuctionListPage
