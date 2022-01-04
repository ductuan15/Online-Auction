import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar, ListItemText,
  makeStyles,
  Paper,
  Typography,
} from '@mui/material'

import {styled, useTheme} from '@mui/material/styles'
import { useUserContext } from '../../../contexts/user/UserContext'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import BackgroundLetterAvatars from "../../user/profile/BackgroundLettersAvatar";
import * as React from "react";

const StyledDiv = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  span: {
    backgroundColor: 'inherit !important',
    color: 'inherit !important',
  },
}))

const ProductComment = (): JSX.Element | null => {
  const {
    state: { userDetails },
  } = useUserContext()

  const {
    state: { currentProduct: product },
  } = useProductContext()
  const theme = useTheme()
  const minSize = '40px'

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
        <Grid item xs={12}>
          <Divider />
        </Grid>

        <List >
          <ListItem alignItems="flex-start">
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
              primary="username"
              secondary={
                <>
                  <Typography variant='body1' color='text.primary'>
                    This is comment
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
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
              primary="username"
              secondary={
                <>
                  <Typography variant='body1' color='text.primary'>
                    This is comment
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </Paper>
    </>
  )
}
export default ProductComment
