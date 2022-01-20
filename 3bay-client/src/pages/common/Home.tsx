import * as React from 'react'
import MainBanner from '../../components/common/home/MainBanner'
import { Grid, Typography } from '@mui/material'
import ProductCarousel from '../../components/common/carousel/ProductCarousel'
import AdminMenu from '../../components/admin/home/AdminMenu'
import { getTop } from '../../services/product.service'
import { useTitle } from '../../hooks'
import bannerDark from '../../assets/banner-dark.jpg'
import bannerLight from '../../assets/banner-light.jpg'
import {useTheme} from '@mui/material/styles'

const Home = (): JSX.Element => {
  const theme = useTheme()
  useTitle('3bay')

  const banner = {
    title: "Smartphones & Accessories",
    description:  'あなたが翻訳すれば、あなたは同性愛者です！',
    image: theme.palette.mode === 'light' ? bannerLight : bannerDark,
    imageText: '',
    linkText: 'Shop now →',
    url: '/products/search/'
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
