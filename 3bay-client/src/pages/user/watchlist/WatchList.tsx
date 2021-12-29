import Product from '../../../models/product'
import Grid from '@mui/material/Grid'
import ProductCard from '../../../components/common/product/ProductCard'
import * as React from 'react'
import { useEffectOnce } from '../../../hooks'
import UserService from '../../../services/user.service'
import { useState } from 'react'
import Box from "@mui/material/Box";

function renderProducts(currentProducts: Product[]): JSX.Element {
  return (
    <>
      {currentProducts &&
        currentProducts.map((product, index) => {
          return (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <ProductCard product={product} />
            </Grid>
          )
        })}
    </>
  )
}

const WatchListPage = (): JSX.Element => {
  const [watchList, setWatchList] = useState<Product[]>([])
  useEffectOnce(() => {
    ;(async () => {
      const response = await UserService.getUserWatchList()
      console.log(response)
      setWatchList(response)
    })()
  })

  return (
    <Grid container display='flex' alignItems='center' flexDirection='column'>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {renderProducts(watchList)}
        </Grid>
      </Box>
    </Grid>
  )
}
export default WatchListPage
