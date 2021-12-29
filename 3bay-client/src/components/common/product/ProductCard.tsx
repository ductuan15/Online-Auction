import { useCallback, useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {
  Box,
  CardActionArea,
  Link,
  Tooltip,
  TypographyStyle,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Product from '../../../models/product'
import { SxProps } from '@mui/system'
import { Theme, useTheme } from '@mui/material/styles'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import moment from 'moment'

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

const titleSx: SxProps<Theme> = (theme) => ({
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'normal',
  '&:hover': {
    color: theme.palette.secondary.dark,
  },
})

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
  overflow: 'hidden',
})

// TODO: reactor me
// TODO: extract the countdown logic
const ProductCard = ({ product }: CardProps): JSX.Element => {
  const theme = useTheme()
  const [scale, setScale] = useState(1.0)
  const [color, setColor] = useState<string>(theme.palette.text.primary)
  // const interval = useRef<NodeJS.Timer>()
  const [endTimeCountDownText, setEndTimeCountDownText] = useState('ENDED')

  useEffect(() => {
    setColor(theme.palette.text.primary)
  }, [theme])

  const onMouseOver = () => {
    setColor(theme.palette.primary.dark)
    setScale(1.2)
  }
  const onMouseOut = () => {
    setColor(theme.palette.text.primary)
    setScale(1.0)
  }

  const totalBidder = product.latestAuction?._count.bids || 0

  const dateCreated = product.createdAt
    ? moment(new Date(product.createdAt))
    : null

  const dateCreatedText = dateCreated
    ? `${dateCreated.fromNow()} (${dateCreated.format('L')})`
    : null

  const closeTimeStr = product.latestAuction?.closeTime || null
  const closeTime = closeTimeStr ? moment(new Date(closeTimeStr)) : null
  const closeTimeFormattedStr = closeTime ? `${closeTime.format('L')} ${closeTime.format('LT')}` : null

  const timer = useRef<NodeJS.Timeout>()

  const showRemaining = useCallback(() => {
    if (!closeTime) return
    const now = moment()

    if (!closeTime.isAfter(now)) {
      if (timer.current) {
        clearInterval(timer.current)
      }
      setEndTimeCountDownText('ENDED')
      return
    }
    // TODO: countdown when the time is less than 24h

    setEndTimeCountDownText(`${now.to(closeTime)} (${closeTimeFormattedStr})`)
  }, [closeTime, closeTimeFormattedStr])

  useEffect(() => {
    showRemaining()
    timer.current = setInterval(showRemaining, 1000)
  }, [showRemaining])

  return (
    <Link
      color='inherit'
      underline='none'
      component={RouterLink}
      to={`/product/${product.id}`}
    >
      <Tooltip title={product.name}>
        <Card
          variant='outlined'
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          sx={(theme) => ({
            '&:hover': {
              borderColor: theme.palette.primary.dark,
            },
            borderWidth: `2px`,
          })}
        >
          <CardActionArea
            sx={{
              '.MuiCardActionArea-focusHighlight': {
                bgcolor: 'transparent',
              },
            }}
          >
            <Box sx={imageSx}>
              <CardMedia
                component='img'
                image={product.thumbnails.lg || ''}
                sx={{
                  width: '100%',
                  height: '100%',
                  transition: `transform .3s`,
                  transform: `scale(${scale})`,
                }}
              />
            </Box>

            <CardContent component={Box} display='flex' flexDirection='column'>
              {/* Product name */}
              <Box
                sx={(theme) => ({
                  height: `${+(theme.typography.h6.lineHeight || 0) * 2.5}rem`,
                })}
              >
                <Typography
                  variant='h6'
                  style={titleStyle}
                  color={color}
                  sx={{ ...titleSx }}
                >
                  {product.name}
                </Typography>
              </Box>

              {/* Current price */}
              <Typography
                variant='button'
                fontSize={`${theme.typography.body1.fontSize}`}
              >
                💵 {product.latestAuction?.currentPrice || '0,000,000'} VND
              </Typography>

              {/* Buy out price */}
              {product.latestAuction?.buyoutPrice && (
                <Typography
                  variant='caption'
                  color='text.secondary'
                  fontStyle='italic'
                >
                  Instant buy with
                  <b> {product.latestAuction?.buyoutPrice} </b> VND
                </Typography>
              )}

              <Box
                display='flex'
                alignItems='center'
                flexDirection='row'
                my={1}
              >
                <Typography variant='body1'>Bid by</Typography>

                {/*Bidder with highest price*/}
                <BackgroundLetterAvatars
                  name={product.latestAuction?.winningBid?.name || 'Tuan Cuong'}
                  fontSize={`${theme.typography.caption.fontSize}`}
                  sx={{
                    ml: 1,
                    width: `25px`,
                    height: `25px`,
                  }}
                />

                <Box flexGrow={1} />

                {/*Display total number of people (excluding 1 person) are currently bidding */}
                {totalBidder >= 0 && (
                  <Typography variant='body2' color='text.secondary'>
                    & <b>{product.latestAuction?._count.bids || 0}</b> other
                    people
                  </Typography>
                )}
              </Box>

              {dateCreated && (
                <Typography variant='body2' color='text.secondary'>
                  {dateCreatedText}
                </Typography>
              )}

              {
                endTimeCountDownText && (
                  <Typography variant='body2' color='text.secondary'>
                    {endTimeCountDownText}
                  </Typography>
                )
              }

            </CardContent>
          </CardActionArea>
        </Card>
      </Tooltip>
    </Link>
  )
}

export default ProductCard
