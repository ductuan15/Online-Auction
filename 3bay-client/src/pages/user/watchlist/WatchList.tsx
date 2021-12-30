import Product from '../../../models/product'
import Grid from '@mui/material/Grid'
import ProductCard from '../../../components/common/product/ProductCard'
import * as React from 'react'
import { useState } from 'react'
import { useEffectOnce } from '../../../hooks'
import UserService from '../../../services/user.service'

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
      {watchList &&
        watchList.map((product, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ProductCard product={product} />
            </Grid>
          )
        })}
    </Grid>
  )
}
export default WatchListPage
