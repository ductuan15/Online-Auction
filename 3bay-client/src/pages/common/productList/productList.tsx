import * as React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CardProduct from '../../../components/common/product/CardProduct'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const Product = (): JSX.Element => {
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
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
    },
    {
      id: 2,
      title: 'product 2',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
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
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
    },
    {
      id: 4,
      title: 'product 4',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
    },
    {
      id: 5,
      title: 'product 5',
      present_price: 45000,
      rate: 3.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
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
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
    },
    {
      id: 7,
      title: 'product 7',
      present_price: 45000,
      rate: 3.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
    },
    {
      id: 8,
      title: 'product 8',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
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
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
    },
    {
      id: 10,
      title: 'product 10',
      present_price: 45000,
      rate: 4.5,
      number_bidder: 123456,
      date: '2021-12-11',
      time: '19:00:00',
      image:
        'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.15752-9/261136866_3212007769028490_6108586411649421599_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=NK6KdSpdGKMAX_Zd5WE&_nc_ht=scontent.fsgn2-4.fna&oh=03_AVLzVcc4x1wJ0YUxlg4ruC2Ao3bLyijqKJEN8_gqFabVoA&oe=61DE6B0D',
    },
  ]
  return (
      <Grid container display='flex' alignItems='center' flexDirection='column'>
          <Box sx={{ flexGrow: 1 }}>
              <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
              >
                  {data.map((product, index) => {
                      return (
                          <Grid item xs={2} sm={4} md={4} key={index}>
                              <CardProduct product={product} />
                          </Grid>
                      )
                  })}
              </Grid>
          </Box>
      </Grid>

  )
}
export default Product
