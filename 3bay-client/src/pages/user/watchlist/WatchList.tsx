import Grid from '@mui/material/Grid'
import * as React from 'react'
import Typography from '@mui/material/Typography'
import { useUserContext } from '../../../contexts/user/UserContext'
import ProductListLayout from '../../../components/common/product-list/ProductListLayout'
import { useTitle } from '../../../hooks'

const WatchListPage = (): JSX.Element => {
  useTitle('3bay | Watchlist')
  const {
    state: { watchlist },
  } = useUserContext()

  return (
    <ProductListLayout
      items={watchlist}
      emptyListComponent={
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
      }
      titleComponent={'My watchlist'}
    />
  )
}
export default WatchListPage
