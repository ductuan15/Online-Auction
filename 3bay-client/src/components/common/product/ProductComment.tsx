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
import moment from 'moment'

type ReviewFormProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleButtonChanged: (e: SyntheticEvent, newPoint: boolean) => void
  point: boolean | undefined
  comment: string
}

type CommentRowProps = {
  name: string
  role: 'BIDDER' | 'SELLER'
  review: boolean | undefined
  comment: string
}

const ReviewForm = ({
  handleChange,
  handleButtonChanged,
  point,
  comment,
}: ReviewFormProps): JSX.Element => {
  return (
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
          onChange={handleButtonChanged}
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
  )
}

const CommentRow = ({
  name,
  role,
  review,
  comment,
}: CommentRowProps): JSX.Element => {
  const theme = useTheme()
  const minSize = '40px'

  return (
    <ListItem alignItems='flex-start'>
      <ListItemAvatar>
        <BackgroundLetterAvatars
          name={name || 'Tuan Cuong'}
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
              {name || 'Tuan Cuong'}
            </Typography>
            <Chip
              sx={{
                mx: 1,
              }}
              color={role === 'BIDDER' ? 'info' : 'success'}
              label={
                <Typography fontWeight={550} variant='body1'>
                  {role}
                </Typography>
              }
            />
            <Typography variant='h6' color='text.primary'>
              {review ? '+1' : '-1'}
            </Typography>
          </Box>
        }
        secondary={
          <Typography variant='body1' color='text.primary'>
            {comment}
          </Typography>
        }
      />
    </ListItem>
  )
}

const ProductComment = (): JSX.Element | null => {
  const {
    state: { userDetails },
  } = useUserContext()

  const {
    state: { latestAuction, currentProduct: product },
  } = useProductContext()

  const [comment, setComment] = useState('')
  const [point, setPoint] = useState<undefined | boolean>(undefined)

  const hasSellerReview = useMemo(() => {
    return latestAuction?.sellerReview !== null // && latestAuction?.sellerComment
  }, [latestAuction?.sellerReview])

  const hasBidderReview = useMemo(() => {
    return latestAuction?.bidderReview !== null // && latestAuction?.bidderComment
  }, [latestAuction?.bidderReview])

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
        await auctionService.addSellerReview(product.id, payload)
      } else if (latestAuction?.winningBid?.bidder.uuid === userDetails?.uuid) {
        const payload = {
          bidderComment: comment,
          bidderReview: point ?? true,
        }
        await auctionService.addBidderReview(product.id, payload)
      }
    } else {
      setComment('')
      setPoint(undefined)
    }
  }, [
    comment,
    latestAuction?.winningBid?.bidder.uuid,
    point,
    product,
    userDetails?.uuid,
  ])

  const closeTimeStr = latestAuction?.closeTime || null
  const closeTime = closeTimeStr ? moment(new Date(closeTimeStr)) : null

  return useMemo(() => {
    if (!product || !latestAuction?.winningBid) return null
    if (latestAuction) {
      if (closeTime?.isAfter()) {
        //closeTime > now => not end auction => null
        return null
      }
    }

    return (
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
            <ReviewForm
              handleChange={handleChange}
              handleButtonChanged={handleButtonChange}
              point={point}
              comment={comment}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <List>
          {hasSellerReview && (
            <CommentRow
              name={product?.seller?.name}
              role={'SELLER'}
              review={latestAuction?.sellerReview}
              comment={latestAuction?.sellerComment}
            />
          )}

          {hasBidderReview && (
            <CommentRow
              name={latestAuction?.winningBid?.bidder?.name}
              role={'BIDDER'}
              review={latestAuction?.bidderReview}
              comment={latestAuction?.bidderComment}
            />
          )}
        </List>
      </Paper>
    )
  }, [
    closeTime,
    comment,
    handleButtonChange,
    handleChange,
    handleSaveButton,
    hasBidderReview,
    hasSellerReview,
    latestAuction,
    point,
    product,
    shouldDisplayReviewForm,
  ])
}
export default ProductComment
