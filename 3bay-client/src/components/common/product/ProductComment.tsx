import {
  Box,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'

import { useTheme } from '@mui/material/styles'
import { useUserContext } from '../../../contexts/user/UserContext'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import * as React from 'react'
import { SyntheticEvent, useCallback, useMemo, useState } from 'react'
import BorderButton from '../button/BorderButton'
import auctionService from '../../../services/auction.service'

const ProductComment = (): JSX.Element | null => {
  const {
    state: { userDetails },
  } = useUserContext()

  const {
    state: { latestAuction, currentProduct: product },
  } = useProductContext()
  const theme = useTheme()
  const minSize = '40px'
  const [comment, setComment] = useState('')
  const [point, setPoint] = useState<undefined | boolean>(undefined)
  const { dispatch } = useProductContext()

  const hasSellerReview = useMemo(() => {
    return latestAuction?.sellerReview !== null && latestAuction?.sellerComment
  }, [latestAuction?.sellerComment, latestAuction?.sellerReview])

  const hasBidderReview = useMemo(() => {
    return latestAuction?.bidderReview !== null && latestAuction?.bidderComment
  }, [latestAuction?.bidderComment, latestAuction?.bidderReview])

  const shouldDisplayReviewForm = useMemo(() => {
    return (
      // User is the seller and they had not reviewed the bidder yet
      (product?.sellerId === userDetails?.uuid &&
        !latestAuction?.sellerComment &&
        !latestAuction?.sellerReview) ||
      // OR
      // User is the Bidder and they had not reviewed the seller yet
      (latestAuction?.winningBid?.bidder.uuid === userDetails?.uuid &&
        !latestAuction?.bidderComment &&
        !latestAuction?.bidderReview)
    )
  }, [
    latestAuction?.bidderComment,
    latestAuction?.bidderReview,
    latestAuction?.sellerComment,
    latestAuction?.sellerReview,
    latestAuction?.winningBid?.bidder.uuid,
    product?.sellerId,
    userDetails?.uuid,
  ])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value)
  }, [])

  const handleButtonChange = useCallback(
    (e: SyntheticEvent, newPoint: boolean) => {
      setPoint(newPoint)
    },
    [],
  )

  const handleSaveButton = useCallback(async () => {
    if (product) {
      if (product.sellerId === userDetails?.uuid) {
        const payload = {
          sellerComment: comment,
          sellerReview: point ?? true,
        }
        const res = await auctionService.addSellerReview(product.id, payload)
        dispatch({
          type: 'UPDATE_AUCTION',
          payload: res,
        })
      } else if (latestAuction?.winningBid?.bidder.uuid === userDetails?.uuid) {
        const payload = {
          bidderComment: comment,
          bidderReview: point ?? true,
        }
        const res = await auctionService.addBidderReview(product.id, payload)
        dispatch({
          type: 'UPDATE_AUCTION',
          payload: res,
        })
      }
    } else {
      setComment('')
      setPoint(undefined)
    }
  }, [
    comment,
    dispatch,
    latestAuction?.winningBid?.bidder.uuid,
    point,
    product,
    userDetails?.uuid,
  ])

  if (!product || !latestAuction) return null
  if (latestAuction) {
    if (new Date(latestAuction.closeTime) > new Date()) {
      return null
    }
  }

  return (
    <>
      <Paper
        elevation={0}
        component={Grid}
        container
        item
        variant='outlined'
        flexDirection='row'
        xs={12}
        p={2}
        my={2}
        px={3}
      >
        <Grid item container xs={12} flexDirection='row'>
          <Typography gutterBottom variant='h4' component='h5'>
            ⭐ Comment
          </Typography>

          <Box flexGrow={1} />

          {shouldDisplayReviewForm && (
            <BorderButton onClick={handleSaveButton}>💾️ Save</BorderButton>
          )}
        </Grid>

        <Grid item container xs={12} flexDirection='row'>
          {shouldDisplayReviewForm && (
            <>
              <Grid
                item
                xs={12}
                container
                flexDirection='row'
                alignItems='center'
                my={2}
              >
                <ToggleButtonGroup
                  color='primary'
                  sx={{ mr: 2 }}
                  size='large'
                  onChange={handleButtonChange}
                  value={point}
                  exclusive
                >
                  <ToggleButton color='info' value={false}>
                    -1
                  </ToggleButton>

                  <ToggleButton color='error' value={true}>
                    +1
                  </ToggleButton>
                </ToggleButtonGroup>

                <Typography variant='h6' color='text.primary'>
                  {point === true && 'Liked this '}
                  {point === false && 'Not okay :('}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  multiline
                  minRows={2}
                  value={comment}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <List>
          {hasSellerReview && (
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <BackgroundLetterAvatars
                  name={product?.seller?.name || 'Tuan Cuong'}
                  fontSize={`${theme.typography.body1.fontSize}`}
                  sx={{
                    width: minSize,
                    height: minSize,
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display='flex' flexDirection='row' alignItems='center'>
                    <Typography variant='h6' color='text.primary'>
                      {product?.seller?.name || 'Tuan Cuong'}
                    </Typography>
                    <Chip
                      sx={{
                        mx: 1,
                      }}
                      color='success'
                      label={
                        <Typography fontWeight={550} variant='body1'>
                          SELLER
                        </Typography>
                      }
                    />
                    <Typography variant='h6' color='text.primary'>
                      {latestAuction.sellerReview ? '+1' : '-1'}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant='body1'>
                    {latestAuction.sellerComment}
                  </Typography>
                }
              />
            </ListItem>
          )}

          {hasBidderReview && (
            <ListItem alignItems='flex-start'>
              <ListItemAvatar>
                <BackgroundLetterAvatars
                  name={latestAuction?.winningBid?.bidder?.name || 'Tuan Cuong'}
                  fontSize={`${theme.typography.body1.fontSize}`}
                  sx={{
                    width: minSize,
                    height: minSize,
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display='flex' flexDirection='row' alignItems='center'>
                    <Typography variant='h6' color='text.primary'>
                      {latestAuction?.winningBid?.bidder?.name || 'Tuan Cuong'}
                    </Typography>
                    <Chip
                      sx={{
                        mx: 1,
                      }}
                      color='info'
                      label={
                        <Typography fontWeight={550} variant='body1'>
                          BIDDER
                        </Typography>
                      }
                    />
                    <Typography variant='h6' color='text.primary'>
                      {latestAuction.bidderReview ? '+1' : '-1'}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant='body1' color='text.primary'>
                    {latestAuction.bidderComment}
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </>
  )
}
export default ProductComment
