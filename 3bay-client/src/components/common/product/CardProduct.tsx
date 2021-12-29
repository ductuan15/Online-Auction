import { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {
  CardActionArea,
  CardHeader,
  Link,
  Tooltip,
  TypographyStyle,
  Zoom,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Product from '../../../models/product'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'

type CardProps = {
  product: Product
}

const titleStyle: TypographyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const imageSx: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.up('xs')]: {
    height: 200,
  },
  [theme.breakpoints.up('md')]: {
    height: 240,
  },
  [theme.breakpoints.up('lg')]: {
    height: 256,
  },
})

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
      <Tooltip title={product.name} TransitionComponent={Zoom}>
        <Card variant='outlined'>
          <CardActionArea>
            <CardMedia
              component='img'
              image={product.thumbnails.lg || ''}
              sx={imageSx}
            />
            <CardHeader
              title={
                <Typography variant='h5' display='block' style={titleStyle}>
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
      </Tooltip>
    </Link>
  )
}

export default CardProduct
