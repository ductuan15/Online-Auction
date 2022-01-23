import Product from '../../../models/product'
import { SxProps } from '@mui/system'
import { useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import CardContent from '@mui/material/CardContent'
import { Box, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { useIsMounted } from '../../../hooks'
import formatNumberToVND from '../../../utils/currency-format'

type CardContentProps = {
  product: Product
  sx?: SxProps
  rowMode?: boolean
}

function ProductCardContent({
  product,
  sx,
  rowMode,
}: CardContentProps): JSX.Element {
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
      if (isMounted()) {
        timer.current && clearInterval(timer.current)
      }
    }
  }, [isMounted, showRemaining])

  return (
    <CardContent component={Box} display='flex' flexDirection='column' sx={sx}>
      <Grid container flexDirection='row' columnSpacing={2}>
        <Grid item xs={rowMode ? 'auto' : 12}>
          {/* Current price */}
          <Typography
            variant='button'
            fontSize={`${theme.typography.body1.fontSize}`}
          >
            💵 {formatNumberToVND(product.latestAuction?.currentPrice || 0)}
          </Typography>
        </Grid>

        <Grid
          item
          xs={rowMode ? 'auto' : 12}
          minHeight={
            !rowMode ? `${theme.typography.caption.lineHeight}em` : undefined
          }
        >
          {/* Buy out price */}
          <Typography
            variant='caption'
            color='text.secondary'
            fontStyle='italic'
          >
            {product.latestAuction?.buyoutPrice && (
              <>
                {' '}
                Buy instantly with{' '}
                <b> {formatNumberToVND(product.latestAuction?.buyoutPrice)} </b>
              </>
            )}
          </Typography>
        </Grid>
      </Grid>

      <Box
        display='flex'
        alignItems='center'
        flexDirection='row'
        my={1}
        minHeight={25}
      >
        {product.latestAuction?._count.bids ? (
          <>
            {/*Bidder with highest price*/}
            {product.latestAuction?.winningBid?.bidder?.name && (
              <>
                <Typography variant='body1'>Bid by</Typography>
                <BackgroundLetterAvatars
                  name={
                    product.latestAuction?.winningBid?.bidder?.name ||
                    'Tuan Cuong'
                  }
                  fontSize={`${theme.typography.caption.fontSize}`}
                  sx={{
                    ml: 1,
                    width: `25px`,
                    height: `25px`,
                  }}
                />
                {rowMode ? <Box mx={1} /> : <Box flexGrow={1} />}
              </>
            )}

            {/*Display total number of bids currently bidding */}
            {totalBidder >= 0 && (
              <Typography variant='body2' color='text.secondary'>
                Total <b>{product.latestAuction?._count.bids || 0}</b> bids
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

      <Grid container flexDirection='row' columnSpacing={2}>
        {dateCreated && (
          <Grid item xs={rowMode ? 'auto' : 12}>
            <Typography
              variant='body2'
              color='text.secondary'
              minHeight={`${theme.typography.body2.lineHeight}em`}
            >
              {dateCreatedText}
            </Typography>
          </Grid>
        )}

        {endTimeCountDownText && (
          <Grid item xs={rowMode ? 'auto' : 12}>
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
          </Grid>
        )}
      </Grid>
    </CardContent>
  )
}

export default ProductCardContent
