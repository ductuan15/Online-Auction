import Product from '../../../models/product'
import { SxProps } from '@mui/system'
import { useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import CardContent from '@mui/material/CardContent'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { useIsMounted } from '../../../hooks'

type CardContentProps = {
  product: Product
  sx?: SxProps
}

function ProductCardContent({ product, sx }: CardContentProps): JSX.Element {
  const theme = useTheme()
  const isMounted = useIsMounted()
  const [endTimeCountDownText, setEndTimeCountDownText] = useState('ENDED')

  const totalBidder = product.latestAuction?._count.bids || 0

  const dateCreated = product.createdAt
    ? moment(new Date(product.createdAt))
    : null

  const dateCreatedText = dateCreated
    ? `${dateCreated.fromNow()} (${dateCreated.format('L')})`
    : null

  const closeTimeStr = product.latestAuction?.closeTime || null
  const closeTime = closeTimeStr ? moment(new Date(closeTimeStr)) : null
  const closeTimeFormattedStr = closeTime
    ? `${closeTime.format('L')} ${closeTime.format('LT')}`
    : null

  const timer = useRef<NodeJS.Timeout>()

  const showRemaining = useCallback(() => {
    if (!closeTime) return
    const now = moment()

    if (!closeTime.isAfter(now)) {
      if (timer.current) {
        clearInterval(timer.current)
      }
      setEndTimeCountDownText('🔴 ENDED')
      return
    }
    // TODO: countdown when the time is less than 24h // NOT URGENT
    if (isMounted()) {
      setEndTimeCountDownText(
        `🟢 ${now.to(closeTime)} (${closeTimeFormattedStr})`,
      )
    }
  }, [closeTime, closeTimeFormattedStr, isMounted])

  useEffect(() => {
    showRemaining()
    timer.current = setInterval(showRemaining, 1000)
    return () => {
      timer.current && clearInterval(timer.current)
    }
  }, [showRemaining])

  return (
    <CardContent component={Box} display='flex' flexDirection='column' sx={sx}>
      {/* Current price */}
      <Typography
        variant='button'
        fontSize={`${theme.typography.body1.fontSize}`}
      >
        💵 {product.latestAuction?.currentPrice || '0,000,000'} VND
      </Typography>

      {/* Buy out price */}
      <Typography
        variant='caption'
        color='text.secondary'
        fontStyle='italic'
        minHeight={`${theme.typography.caption.lineHeight}em`}
      >
        {product.latestAuction?.buyoutPrice && (
          <>
            {' '}
            Instant buy with
            <b> {product.latestAuction?.buyoutPrice} </b> VND
          </>
        )}
      </Typography>

      <Box
        display='flex'
        alignItems='center'
        flexDirection='row'
        my={1}
        minHeight={25}
      >
        {product.latestAuction?._count.bids ? (
          <>
            <Typography variant='body1'>Bid by</Typography>

            {/*Bidder with highest price*/}
            <BackgroundLetterAvatars
              name={
                product.latestAuction?.winningBid?.bidder?.name || 'Tuan Cuong'
              }
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
                & <b>{product.latestAuction?._count.bids || 0}</b> other people
              </Typography>
            )}
          </>
        ) : (
          <Typography variant='body2' color='text.secondary'>
            <b>
              <i>No one has bid this product</i>
            </b>
          </Typography>
        )}
      </Box>

      {dateCreated && (
        <Typography
          variant='body2'
          color='text.secondary'
          minHeight={`${theme.typography.body2.lineHeight}em`}
        >
          {dateCreatedText}
        </Typography>
      )}

      {endTimeCountDownText && (
        <Typography
          variant='body2'
          color='text.secondary'
          height={`${theme.typography.body2.lineHeight}em`}
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {endTimeCountDownText}
        </Typography>
      )}
    </CardContent>
  )
}

export default ProductCardContent
