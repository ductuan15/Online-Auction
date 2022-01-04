import {
  Box,
  Button,
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
import { SyntheticEvent, useState } from 'react'

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
  const [point, setPoint] = useState<null | string>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value)
  }

  const handleButtonChange = (e: SyntheticEvent, newPoint: string) => {
    setPoint(newPoint)
  }

  // const onButtonPlusClicked = () => {
  //   // console.log('Plus')
  //   setPoint(1)
  // }
  // const onButtonMinusClicked = () => {
  //   // console.log('Minus')
  //   setPoint(-1)
  // }

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
              userDetails?.uuid) && (
            <Button variant='outlined'>➕️ Save</Button>
          )}
        </Grid>
        <Grid item container xs={12} flexDirection='row'>
          {(product.sellerId === userDetails?.uuid ||
            product.latestAuction?.winningBid?.bidder.uuid ===
              userDetails?.uuid) && (
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
                  <ToggleButton color='info' value={'-1'}>
                    -1
                  </ToggleButton>

                  <ToggleButton color='error' value={'1'}>
                    +1
                  </ToggleButton>
                </ToggleButtonGroup>

                <Typography variant='h6' color='text.primary'>
                  {point === '1' && 'Liked this '}
                  {point === '-1' && 'Not okay :('}
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
                </Box>
              }
              secondary={
                <Typography variant='body1'>This is comment</Typography>
              }
            />
          </ListItem>
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <BackgroundLetterAvatars
                name={
                  product?.latestAuction?.winningBid?.bidder?.name ||
                  'Tuan Cuong'
                }
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
                    {product?.latestAuction?.winningBid?.bidder?.name ||
                      'Tuan Cuong'}
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
                </Box>
              }
              secondary={
                <Typography variant='body1' color='text.primary'>
                  This is comment
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </>
  )
}
export default ProductComment