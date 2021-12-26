import * as React from 'react'
import { Link, Paper, Rating } from '@mui/material'
import Typography from '@mui/material/Typography'
import Product from '../../../data/product'
import moment from 'moment'

type productDetailProps = {
  product: Product | undefined
}
const ProductInfo = ({ product }: productDetailProps): JSX.Element | null => {
  const value = 3
  // const startDate: Date | null = product?.createdAt
  //   ? new Date(product?.createdAt)
  //   : null

  return product ? (
    <Paper elevation={0}>
      <Typography gutterBottom variant='h4' component='h4'>
        {product.name}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Category: {product.category.title}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        Current price: {product.lastestAuction?.currentPrice}
      </Typography>
      {/*/!*Giá mua ngay (nếu có)*!/*/}
      {/*<Typography variant='body1' color='text.secondary'>*/}
      {/*    Giá mua ngay:*/}
      {/*</Typography>*/}
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
        Start at: {product?.createdAt ? moment(product?.createdAt).format('DD/MM/YYYY') : 'UNKNOWN'}
      </Typography>
      <Typography variant='body1' color='text.secondary'>
        End at (để relative Time khi tgian còn 3 ngày):
      </Typography>
    </Paper>
  ) : null
}

export default ProductInfo
