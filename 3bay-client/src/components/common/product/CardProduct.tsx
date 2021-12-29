import { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, CardHeader, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Product from '../../../models/product'

type CardProps = {
  product: Product
}

const CardProduct = ({ product }: CardProps): JSX.Element => {
  const [hours, setHours] = useState(1)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const interval = useRef<NodeJS.Timer>()

  useEffect(() => {
    interval.current = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setSeconds(59)
          setMinutes(59)
          setHours(hours - 1)
          if (hours === 0 && interval.current) {
            clearInterval(interval.current)
          }
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => {
      if (interval.current) {
        clearInterval(interval.current)
      }
    }
  }, [hours, minutes, seconds])

  return (
    <Link
      color='inherit'
      underline='none'
      component={RouterLink}
      to={`/product/${product.id}`}
    >
      <Card>
        <CardActionArea>
          <CardMedia
            component='img'
            image={product.thumbnails.original || ''}
            sx={(theme) => ({
              [theme.breakpoints.up('xs')]: {
                height: 256,
              },
              [theme.breakpoints.up('md')]: {
                height: 300,
              },
            })}
          />
          <CardHeader
            title={
              <Typography
                gutterBottom
                variant='h5'
                display='block'
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.name}
              </Typography>
            }
          />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              {product.latestAuction?._count.bids || ''}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {product.latestAuction?.currentPrice || ''} VND
              {product.latestAuction?.buyoutPrice ?? (
                <span> to {product.latestAuction?.buyoutPrice} VND</span>
              )}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              from {product.latestAuction?.startTime || ''}
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
