import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Grid, Link, Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import Box from '@mui/material/Box'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import _ from 'lodash'
import { useUserContext } from '../../../contexts/user/UserContext'
import {
  addToWatchList,
  deleteProdWatchList,
} from '../../../services/product.service'
import { Link as RouterLink } from 'react-router-dom'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { useTheme } from '@mui/material/styles'
import BorderIconButton from '../button/BorderIconButton'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import BidButton from '../bid/BidButton'
import formatNumberToVND from '../../../utils/currency-format'
import { nameMasking } from '../../../utils/name-mask'

type UserWithRatingProps = {
  isNeedNameMasking: boolean
  name: string
  rating?: number
  label: string
  minHeight?: string
}

const UserWithRating = ({
  isNeedNameMasking,
  name,
  label,
  minHeight,
  rating,
}: UserWithRatingProps): JSX.Element => {
  const minSize = useMemo(() => minHeight ?? '40px', [minHeight])

  const theme = useTheme()

  return (
    <Box
      display='flex'
      alignItems='center'
      flexDirection='row'
      my={1}
      minHeight={minSize}
    >
      <Typography
        variant='body1'
        color='text.secondary'
        style={{
          display: 'inline-block',
        }}
      >
        {label}
      </Typography>

      {/*Bidder with highest price*/}
      <BackgroundLetterAvatars
        name={name || 'Tuan Cuong'}
        fontSize={`${theme.typography.body1.fontSize}`}
        sx={{
          mx: 1,
          width: minSize,
          height: minSize,
        }}
      />

      <Typography variant='body1' color='text.primary' sx={{ mr: 1 }}>
        {isNeedNameMasking ? nameMasking(name) : name}
      </Typography>

      <Typography variant={'subtitle2'} color='text.primary'>
        {rating !== undefined ? `(${rating * 100}% approval)` : `(No rating)`}
      </Typography>
    </Box>
  )
}

const ProductInfo = (): JSX.Element | null => {
  const [endTimeCountDownText, setEndTimeCountDownText] = useState('ENDED')
  const timer = useRef<NodeJS.Timeout>()
  const {
    state: { watchlist, userDetails },
    dispatch,
  } = useUserContext()

  const {
    state: {
      currentProduct: product,
      latestAuction,
      sellerPoint,
      winningBidderPoint,
      bidStatus,
    },
  } = useProductContext()

  const isInWatchlist = useMemo(() => {
    return (
      _.findIndex(watchlist, function (p) {
        return p.id === product?.id
      }) > -1
    )
  }, [product?.id, watchlist])

  const closeTime = useMemo(() => {
    const closeTimeStr = latestAuction?.closeTime || null
    return closeTimeStr ? moment(new Date(closeTimeStr)) : null
  }, [latestAuction?.closeTime])

  const closeTimeFormattedStr = useMemo(() => {
    return closeTime
      ? `${closeTime.format('L')} ${closeTime.format('LT')}`
      : null
  }, [closeTime])

  const dateCreated = useMemo(() => {
    return product?.createdAt
      ? moment(new Date(product?.createdAt))
      : null
  }, [product?.createdAt])

  const dateCreatedText = useMemo(() => {
    return dateCreated
      ? `${dateCreated.fromNow()} (${dateCreated.format('L')})`
      : null
  }, [dateCreated])

  const showRemaining = useCallback(() => {
    if (!closeTime) return
    // const now = moment()

    if (!closeTime.isAfter()) {
      if (timer.current) {
        clearInterval(timer.current)
      }
      setEndTimeCountDownText(
        `🔴 ENDED ${moment().from(closeTime)} (${closeTimeFormattedStr})`,
      )
      return
    }

    setEndTimeCountDownText(
      `🟢 ${moment().to(closeTime)} (${closeTimeFormattedStr})`,
    )
  }, [closeTime, closeTimeFormattedStr])

  const onWatchlistButtonClicked = useCallback(async () => {
    if (!product) return

    const prodIndex = _.findIndex(watchlist, function (p) {
      return p.id === product.id
    })

    if (prodIndex !== -1) {
      const res = await deleteProdWatchList(product.id)
      dispatch({
        type: 'DELETE_WATCH_LIST',
        payload: res.data.productId,
      })
    } else {
      await addToWatchList(product.id)
      dispatch({
        type: 'ADD_WATCH_LIST',
        payload: product,
      })
    }
  }, [dispatch, product, watchlist])

  useEffect(() => {
    showRemaining()
    timer.current = setInterval(showRemaining, 1000)
    return () => {
      timer.current && clearInterval(timer.current)
    }
  }, [showRemaining])

  return product ? (
    <Grid container flexDirection='row'>
      <Grid item xs={12}>
        <Typography
          gutterBottom
          variant='h4'
          component='h4'
          fontWeight={600}
          color='text.primary'
          sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
              textAlign: 'center',
            },
          })}
        >
          {product.name}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Link
          component={RouterLink}
          to={`/products/search/?key=&categoryId=${product.categoryId}`}
          underline='none'
          color='primary.main'
        >
          🏷️ {product.category.title}
        </Link>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h3' color='text.primary' fontWeight={600}>
          💵 {formatNumberToVND(latestAuction?.currentPrice || 0)}
        </Typography>
      </Grid>

      {latestAuction?.buyoutPrice && (
        <Grid item xs={12}>
          <Typography
            variant='subtitle1'
            color='text.primary'
            fontStyle='italic'
          >
            💨 Buy instantly with&nbsp;
            <b>{formatNumberToVND(latestAuction?.buyoutPrice)}</b>
          </Typography>
        </Grid>
      )}

      <Grid item xs={12}>
        <UserWithRating
          isNeedNameMasking={false}
          name={product.seller.name}
          label={'Sold by'}
          rating={sellerPoint}
        />
      </Grid>

      <Grid item xs={12}>
        {latestAuction?.winningBid?.bidder?.name ? (
          <UserWithRating
            isNeedNameMasking={true}
            name={latestAuction?.winningBid?.bidder?.name || 'Tuan Cuong'}
            label={'Bid by \u00a0\u00a0'}
            rating={winningBidderPoint}
          />
        ) : (
          <Typography variant='body2' color='text.secondary'>
            <b>
              <i>Become the first person to bid the product</i>
            </b>
          </Typography>
        )}
      </Grid>

      <Grid
        item
        container
        xs={12}
        alignItems='center'
        justifyContent='space-between'
        flexDirection='row'
        mt={1}
      >
        {dateCreated && (
          <Grid item xs={12} sm={'auto'}>
            <Typography variant='body1' color='text.secondary'>
              {dateCreatedText}
            </Typography>
          </Grid>
        )}

        {endTimeCountDownText && (
          <Grid item xs={12} sm={'auto'}>
            <Typography variant='body1' color='text.secondary'>
              {endTimeCountDownText}
              {latestAuction?.autoExtendAuctionTiming ? '*' : ''}
            </Typography>
          </Grid>
        )}
      </Grid>

      {bidStatus?.maximumAutoBidPrice &&
        latestAuction?.closeTime &&
        moment(latestAuction?.closeTime)?.isAfter() && (
          <Grid item xs={12} mt={1}>
            <Typography
              variant='subtitle1'
              color='text.primary'
              // fontStyle='italic'
            >
              ⌛ Executing automatic bidding with maximum price of&nbsp;
              <b>{formatNumberToVND(bidStatus?.maximumAutoBidPrice)}</b>
            </Typography>
          </Grid>
        )}

      {product && (
        <Grid
          item
          container
          xs={12}
          justifyContent='space-between'
          alignItems='center'
          alignContent='center'
          my={1}
        >
          <BidButton />

          <Box flexGrow={1} />

          {userDetails &&
            latestAuction &&
            moment(latestAuction?.closeTime).isAfter() && (
              <BorderIconButton
                size='large'
                onClick={onWatchlistButtonClicked}
                isSelected={isInWatchlist}
                color='error'
                sx={{ mt: 1 }}
              >
                <Tooltip title='Add to watchlist'>
                  {isInWatchlist ? (
                    <FavoriteOutlinedIcon color='error' />
                  ) : (
                    <FavoriteBorderOutlinedIcon color='error' />
                  )}
                </Tooltip>
              </BorderIconButton>
            )}
        </Grid>
      )}
    </Grid>
  ) : null
}

export default ProductInfo
