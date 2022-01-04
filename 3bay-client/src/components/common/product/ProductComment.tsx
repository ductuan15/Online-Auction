import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import { useTheme } from '@mui/material/styles'
import { useUserContext } from '../../../contexts/user/UserContext'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import * as React from 'react'
import { useState } from 'react'
import PlusOneIcon from '@mui/icons-material/PlusOne'

const ProductComment = (): JSX.Element | null => {
  const {
    state: { userDetails },
  } = useUserContext()

  const {
    state: { currentProduct: product },
  } = useProductContext()
  const theme = useTheme()
  const minSize = '40px'
  const [comment, setComment] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value)
  }

  const buttonplus_onClicked = () => {
    console.log('Plus')
  }
  const buttonminus_onClicked = () => {
    console.log('Minus')
  }

  if (!product) return null
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
        px={3}
      >
        <Grid item container xs={12} flexDirection='row'>
          <Typography gutterBottom variant='h4' component='h5'>
            ⭐ Comment
          </Typography>

          <Box flexGrow={1} />

          {(product.sellerId === userDetails?.uuid ||
            product.latestAuction?.winningBid?.bidder.uuid ===
              userDetails?.uuid) && <Button>➕️ Save</Button>}
        </Grid>
        <Grid item container xs={12} flexDirection='row'>
          {(product.sellerId === userDetails?.uuid ||
            product.latestAuction?.winningBid?.bidder.uuid ===
              userDetails?.uuid) && (
            <>
              <ButtonGroup disableElevation variant='contained'>
                <Button onClick={buttonplus_onClicked}>
                  <Typography variant='body2' color='text.secondary'>
                    <b>➕1</b>
                  </Typography>
                </Button>
                <Button onClick={buttonminus_onClicked}>
                  {' '}
                  <Typography variant='body2' color='text.secondary'>
                    <b>➖1</b>
                  </Typography>
                </Button>
              </ButtonGroup>
              <TextField
                multiline
                value={comment}
                onChange={handleChange}
                sx={{
                  width: 1,
                }}
              />
            </>
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <List>
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <BackgroundLetterAvatars
                name={'Seller'}
                fontSize={`${theme.typography.body1.fontSize}`}
                sx={{
                  width: minSize,
                  height: minSize,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography variant='body1' color='text.primary'>
                    Sellername
                    <Chip
                      sx={{
                        mx: 1,
                      }}
                      color='success'
                      label={
                        <Typography fontWeight={550} variant='body1'>
                          Seller
                        </Typography>
                      }
                    />
                  </Typography>
                </>
              }
              secondary={
                <>
                  <Typography variant='body1' color='text.primary'>
                    This is comment
                  </Typography>
                </>
              }
            />
          </ListItem>
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <BackgroundLetterAvatars
                name={'Bidder'}
                fontSize={`${theme.typography.body1.fontSize}`}
                sx={{
                  width: minSize,
                  height: minSize,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography variant='body1' color='text.primary'>
                    Biddername
                    <Chip
                      sx={{
                        mx: 1,
                      }}
                      color='success'
                      label={
                        <Typography fontWeight={550} variant='body1'>
                          Bidder
                        </Typography>
                      }
                    />
                  </Typography>
                </>
              }
              secondary={
                <>
                  <Typography variant='body1' color='text.primary'>
                    This is comment
                  </Typography>
                </>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </>
  )
}
export default ProductComment
