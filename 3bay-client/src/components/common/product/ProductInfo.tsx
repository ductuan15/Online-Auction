import * as React from 'react'
import { Button, Link, Paper, Rating } from '@mui/material'
import Typography from '@mui/material/Typography'
import Product from '../../../models/product'
import moment from 'moment'
import Box from '@mui/material/Box'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import _ from 'lodash'
import { useUserContext } from '../../../contexts/user/UserContext'
import UserService from '../../../services/user.service'
import {
  addToWatchList,
  deleteProdWatchList,
} from '../../../services/product.service'

type productDetailProps = {
  product: Product
}
const ProductInfo = ({ product }: productDetailProps): JSX.Element | null => {
  const value = 3
  // const startDate: Date | null = product?.createdAt
  //   ? new Date(product?.createdAt)
  //   : null

  const { dispatch } = useUserContext()

  const addToWatchList_Clicked = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const response = await UserService.getUserWatchList()
    const prodIndex = _.findIndex(response, function (p) {
      return p.id === product.id
    })
    if (prodIndex !== -1) {
      const res = await deleteProdWatchList(product.id)
      dispatch({
        type: 'DELETE_WATCH_LIST',
        payload: res.data.productId,
      })
    } else {
      await addToWatchList(product?.id)
      dispatch({
        type: 'ADD_WATCH_LIST',
        payload: product,
      })
    }
  }

  const {
    state: { watchlist },
  } = useUserContext()

  return product ? (
    <Paper elevation={0}>
      <Typography gutterBottom variant='h4' component='h4'>
        {product.name}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Category: {product.category.title}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Current price: {product.latestAuction?.currentPrice} VND
      </Typography>
      {/*/!*Giá mua ngay (nếu có)*!/*/}
      <Typography variant='body1' color='text.secondary'>
        Buyout price: <span> {product.latestAuction?.buyoutPrice} </span> VND
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Seller: <Link href='#'>{product.seller.name}</Link> (
        <Rating
          name='read-only'
          value={value}
          readOnly
          precision={0.5}
          size={'small'}
        />
        )
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Start at:{' '}
        {product?.createdAt
          ? moment(product?.createdAt).format('DD/MM/YYYY')
          : 'UNKNOWN'}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        End at (để relative Time khi tgian còn 3 ngày):
      </Typography>

      <Box sx={{ flexGrow: 1 }} />

      {_.findIndex(watchlist, function (p) {
        return p.id === product.id
      }) > -1 ? (
        <Button
          variant='outlined'
          startIcon={<FavoriteOutlinedIcon />}
          onClick={addToWatchList_Clicked}
        >
          Remove from WatchList
        </Button>
      ) : (
        <Button
          variant='outlined'
          startIcon={<FavoriteBorderOutlinedIcon />}
          onClick={addToWatchList_Clicked}
        >
          Add to WatchList
        </Button>
      )}
    </Paper>
  ) : null
}

export default ProductInfo
