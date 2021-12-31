import Grid from '@mui/material/Grid'
import ProductCard from '../../../components/common/product/ProductCard'
import * as React from 'react'
import Typography from "@mui/material/Typography";
import {useUserContext} from "../../../contexts/user/UserContext";

const WatchListPage = (): JSX.Element => {
  const {
    state: { watchlist },
  } = useUserContext()

  return (
    <Grid container display='flex' alignItems='center' flexDirection='row' spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {
        watchlist.length > 0 ?
          watchlist.map((product, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ProductCard product={product} />
            </Grid>
          )
        })
        :
          <Typography
            pt={2}
            gutterBottom
            variant='h4'
            component='h5'
            color='text.primary'
            align='center'
          >
            You don&apos;t have any products in watch list. Please return to home page to search your favorite products
          </Typography>

      }
    </Grid>
  )
}
export default WatchListPage
