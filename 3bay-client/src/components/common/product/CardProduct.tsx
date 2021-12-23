import * as React from 'react'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Product from "../../../data/product";

type CardProps = {
  product: Product
}

const CardProduct = ({ product }: CardProps): JSX.Element => {
  const [hours, setHours] = useState(1)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  let interval: NodeJS.Timer
  useEffect(() => {
    interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setSeconds(59)
          setMinutes(59)
          setHours(hours - 1)
          if (hours === 0) {
            clearInterval(interval)
          }
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })
  return (
    <Link
      color='inherit'
      underline='none'
      component={RouterLink}
      to='/product/1'
    >
      <Card sx={{ maxWidth: 350 }}>
        <CardActionArea>
          <CardMedia
            component='img'
            image={product.image}
            sx={(theme) => ({
              [theme.breakpoints.up('xs')]: {
                height: 256,
              },
              [theme.breakpoints.up('md')]: {
                height: 300,
              },
            })}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {product.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              ({product.number_bidder})
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {product.currentPrice} VND
              {product.buy_now_price ? (
                <span> to {product.buy_now_price} VND</span>
              ) : null}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              from {product.date}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {minutes === 0 && seconds === 0 ? null : (
                <span>
                  {' '}
                  {hours}:{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}

export default CardProduct
