import * as React from 'react'
import HomeLayout from '../../components/layout/HomeLayout'
import MainBanner from '../../components/common/home/MainBanner'
import { Grid, Typography } from '@mui/material'
import CarouselCard from "../../components/common/Carousel";

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
    <HomeLayout>
      <MainBanner {...banner} />
      <Grid container display='flex' alignItems='center' flexDirection='column'>
        <Typography
          component='h2'
          variant='h4'
          gutterBottom
          color='primary.main'
        >
          💎 Top sale gì gì đó
        </Typography>
        <Typography
          component='h2'
          variant='h4'
          gutterBottom
          color='primary.main'
        >
          👁️👄👁️
        </Typography>

        <CarouselCard/>
      </Grid>
    </HomeLayout>
  )
}

export default Home
