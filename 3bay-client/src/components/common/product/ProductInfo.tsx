import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Grid, Link, Rating, Tooltip } from '@mui/material'
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
import ProductBidButton from './ProductBidButton'

type UserWithRatingProps = {
  name: string
  rating?: number
  label: string
  minHeight?: string
}

const UserWithRating = ({
  name,
  label,
  minHeight,
  rating,
}: UserWithRatingProps): JSX.Element => {
  const minSize = minHeight ?? '40px'

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

      <Typography variant='body1' color='text.primary'>
        {name}
      </Typography>

      <Rating
        name='read-only'
        value={rating}
        readOnly
        precision={0.5}
        size={'small'}
        sx={{ mx: 2 }}
      />
    </Box>
  )
}

const ProductInfo = (): JSX.Element | null => {
  const { dispatch } = useUserContext()
  const [endTimeCountDownText, setEndTimeCountDownText] = useState('ENDED')
  const timer = useRef<NodeJS.Timeout>()
  const {
    state: { watchlist },
  } = useUserContext()

  const {
    state: { currentProduct: product },
  } = useProductContext()

  const isInWatchlist = useMemo(() => {
    return (
      _.findIndex(watchlist, function (p) {
        return p.id === product?.id
      }) > -1
    )
  }, [product?.id, watchlist])

  const closeTimeStr = product?.latestAuction?.closeTime || null
  const closeTime = closeTimeStr ? moment(new Date(closeTimeStr)) : null
  const closeTimeFormattedStr = closeTime
    ? `${closeTime.format('L')} ${closeTime.format('LT')}`
    : null

  const dateCreated = product?.createdAt
    ? moment(new Date(product?.createdAt))
    : null
  const dateCreatedText = dateCreated
    ? `${dateCreated.fromNow()} (${dateCreated.format('L')})`
    : null

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

    setEndTimeCountDownText(
      `🟢 ${now.to(closeTime)} (${closeTimeFormattedStr})`,
    )
  }, [closeTime, closeTimeFormattedStr])

  const onWatchlistButtonClicked = async () => {
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
  }

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
          to={`/products/search/?key=&categoryId=${product.categoryId}&sortBy=closeTime&sortType=desc&page=1`}
          underline='none'
          color='primary.main'
        >
          🏷️ {product.category.title}
        </Link>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h3' color='text.primary' fontWeight={600}>
          💵 ₫{product.latestAuction?.currentPrice}
        </Typography>
      </Grid>

      {product?.latestAuction?.buyoutPrice && (
        <Grid item xs={12}>
          <Typography
            variant='subtitle1'
            color='text.primary'
            fontStyle='italic'
          >
            💨 Instant buy with ₫{product.latestAuction?.buyoutPrice}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12}>
        <UserWithRating name={product.seller.name} label={'Sold by'} />
      </Grid>

      <Grid item xs={12}>
        {product.latestAuction?.winningBid?.bidder?.name ? (
          <UserWithRating
            name={product.latestAuction?.winningBid?.bidder?.name}
            label={'Bid by \u00a0\u00a0'}
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
              {product?.latestAuction?.autoExtendAuctionTiming ? '*' : ''}
            </Typography>
          </Grid>
        )}
      </Grid>

      {product && closeTime?.isAfter() && (
        <Grid
          item
          container
          xs={12}
          justifyContent='space-between'
          alignItems='center'
        >
          <ProductBidButton />

          <Box flexGrow={1} />

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
        </Grid>
      )}
    </Grid>
  ) : null
}

export default ProductInfo
