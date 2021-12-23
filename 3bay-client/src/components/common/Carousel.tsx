import React from 'react'
import CardProduct from './product/CardProduct'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import './Carousel.css'
import { Container, Divider } from '@mui/material'
import Typography from '@mui/material/Typography'
import Product from "../../data/product";

type carouselProps = {
  name: string
}

const CarouselCard = ({ name }: carouselProps): JSX.Element => {
  const imageLink =
    'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D'

  const data = [
    {
      id: 1,
      title: 'product 1',
      present_price: 45000,
      rate: 4.5,
      buy_now_price: 100000,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 2,
      title: 'product 2',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 3,
      title: 'product 3',
      present_price: 45000,
      rate: 4.5,
      buy_now_price: 100000,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 4,
      title: 'product 4',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 5,
      title: 'product 5',
      present_price: 45000,
      rate: 3.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 6,
      title: 'product 6',
      present_price: 45000,
      rate: 4.5,
      buy_now_price: 100000,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 7,
      title: 'product 7',
      present_price: 45000,
      rate: 3.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 8,
      title: 'product 8',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 9,
      title: 'product 9',
      present_price: 45000,
      rate: 3.5,
      buy_now_price: 100000,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: imageLink,
    },
    {
      id: 10,
      title: 'product 10',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image: 'http://http.cat/404',
    },
  ]
  const responsive = {
    xl: {
      breakpoint: { min: 1536, max: 4000 },
      items: 4,
    },
    lg: {
      breakpoint: { min: 1200, max: 1535 },
      items: 4,
    },
    md: {
      breakpoint: { min: 900, max: 1999 },
      items: 3,
    },
    sm: {
      breakpoint: { min: 600, max: 799 },
      items: 2,
    },
    xs: {
      breakpoint: { min: 0, max: 599 },
      items: 1,
    },
  }

  return (
    <Container>
      <Divider />
      <Typography
        pt={2}
        gutterBottom
        variant='h4'
        component='h5'
        color='text.primary'
        align='center'
      >
        {name}
      </Typography>
      <Carousel
        renderButtonGroupOutside={true}
        draggable={false}
        showDots
        responsive={responsive} //Numbers of slides to show at each breakpoint
        // ssr={true} // means to render carousel on server-side.
        infinite
        autoPlay
        autoPlaySpeed={3000}
        customTransition='transform 300ms ease-in-out'
        transitionDuration={300}
        containerClass='container-with-dots'
        itemClass='carousel-item-padding-20-px'
      >
        {data.map((product, index) => {
          return <CardProduct key={index} product={new Product(product)} />
        })}
      </Carousel>
    </Container>
  )
}

export default CarouselCard
