import Product from '../../../models/product'
import { Box, CardMedia, Grid, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import formatNumberToVND from '../../../utils/currency-format'

const ProductShortRow = ({ product }: { product: Product }) => {
  return (
    <Grid
      container
      flexDirection='row'
      spacing={2}
      alignContent='center'
      py={1}
      component={RouterLink}
      to={`/product/${product.id}`}
      style={{ textDecoration: 'inherit' }}
    >
      <Grid item>
        <Box sx={{ width: 64, height: 64 }}>
          <CardMedia
            component='img'
            image={product.thumbnails.md || ''}
            sx={{
              width: 'inherit',
              height: 'inherit',
              borderRadius: `4px`,
            }}
          />
        </Box>
      </Grid>

      <Grid
        item
        container
        flexDirection='column'
        xs='auto'
        spacing={0.5}
        alignItems='flex-start'
        justifyContent='center'
      >
        <Typography color='text.primary' fontWeight={600} noWrap>
          {product.name}
        </Typography>

        <Typography variant='caption' color='text.primary'>
          💵 {formatNumberToVND(product.latestAuction?.currentPrice || 0)}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default ProductShortRow
