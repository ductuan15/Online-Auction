import * as React from 'react'
import HomeLayout from '../../components/layout/HomeLayout'
import MainBanner from '../../components/common/home/MainBanner'
import ProductCard from '../../components/common/product/ProductCard'
import { Grid, Typography } from '@mui/material'

const Home = (): JSX.Element => {
  const banner = {
    title: "Hello world! I'm a banner",
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
      'labore et dolore magna aliqua.',
    image: 'https://source.unsplash.com/random',
    imageText: '',
    linkText: 'Go to this',
  }

  const products = [{ name: 'Product 1' }]

  return (
    <HomeLayout>
      <MainBanner {...banner} />
      <Grid container display='flex' alignItems='center' flexDirection='column'>
        <Typography component='h2' variant='h4' gutterBottom>
          💎 Top sale gì gì đó
        </Typography>

        <Grid
          container
          spacing={2}
          display='flex'
          alignItems='center'
          flexDirection='row'
        >
          <Grid item xs={6} md={4} lg={3}>
            <ProductCard product={products[0]} />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <ProductCard product={products[0]} />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <ProductCard product={products[0]} />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <ProductCard product={products[0]} />
          </Grid>
        </Grid>
      </Grid>
    </HomeLayout>
  )
}

export default Home
