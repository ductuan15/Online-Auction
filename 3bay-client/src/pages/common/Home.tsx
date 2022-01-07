import * as React from 'react'
import MainBanner from '../../components/common/home/MainBanner'
import { Grid, Typography } from '@mui/material'
import ProductCarousel from '../../components/common/carousel/ProductCarousel'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/admin/home/AdminMenu'
import { getTop } from '../../services/product.service'

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

  return (
    <>
      <MainBanner {...banner} />

      <AdminMenu />

      <Grid container display='flex' alignItems='center' flexDirection='column'>
        <Typography
          component='h2'
          variant='h4'
          gutterBottom
          color='primary.main'
        >
          💎 Best selling items
        </Typography>

        <Typography
          component='h2'
          variant='h4'
          gutterBottom
          color='primary.main'
        >
          👁️👄👁️
        </Typography>

        <ProductCarousel
          name={'⌛ Close time'}
          fetchFunction={getTop.getTopCloseTime}
          showLoading={true}
        />

        <ProductCarousel
          name={'🔎 Popular products'}
          fetchFunction={getTop.getTopBidNum}
          showLoading={true}
        />

        <ProductCarousel
          name={'💰 Highest price'}
          fetchFunction={getTop.getTopPrice}
          showLoading={true}
        />
      </Grid>
    </>
  )
}

export default Home
