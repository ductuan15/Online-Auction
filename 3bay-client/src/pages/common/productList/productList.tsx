import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CardProduct from '../../../components/common/product/CardProduct'
import Product from '../../../data/product'

// type productProps = {
//   currentProducts: Product[]
// }

const sampleImage =
  'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D'
const data = [
  {
    id: 1,
    name: 'product 1',
    currentPrice: 45000,
    rate: 4.5,
    buy_now_price: 100000,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 2,
    name: 'product 2',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 3,
    name: 'product 3',
    currentPrice: 45000,
    rate: 4.5,
    buy_now_price: 100000,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 4,
    name: 'product 4',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 5,
    name: 'product 5',
    currentPrice: 45000,
    rate: 3.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 6,
    name: 'product 6',
    currentPrice: 45000,
    rate: 4.5,
    buy_now_price: 100000,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 7,
    name: 'product 7',
    currentPrice: 45000,
    rate: 3.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 8,
    name: 'product 8',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 9,
    name: 'product 9',
    currentPrice: 45000,
    rate: 3.5,
    buy_now_price: 100000,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 10,
    name: 'product 10',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 11,
    name: 'product 11',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 12,
    name: 'product 12',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 13,
    name: 'product 13',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 14,
    name: 'product 14',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
  {
    id: 15,
    name: 'product 15',
    currentPrice: 45000,
    rate: 4.5,
    number_bidder: 123456,
    date: '2021-12-11',
    time: '19:00:00',
    image: sampleImage,
  },
]

function renderProducts(currentProducts: Product[]): JSX.Element {
  return (
    <>
      {currentProducts &&
        currentProducts.map((product, index) => {
          return (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <CardProduct product={product as Product} />
            </Grid>
          )
        })}
    </>
  )
}

const ProductList = (): JSX.Element => {
  return (
    <Grid container display='flex' alignItems='center' flexDirection='column'>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {renderProducts(data as Product[])}
        </Grid>
      </Box>
    </Grid>
  )
}
export default ProductList
