import Product from '../../../models/product'
import {
  Box,
  CardMedia,
  Stack,
  Typography,
  TypographyStyle,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import formatNumberToVND from '../../../utils/currency-format'

const titleStyle: TypographyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const ProductShortRow = ({ product }: { product: Product }) => {
  return (
    <Box
      display='flex'
      flexDirection='row'
      py={1}
      component={RouterLink}
      to={`/product/${product.id}`}
      style={{ textDecoration: 'inherit' }}
      sx={{ width: 1 }}
    >
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

      <Box flexGrow={1} px={1}>
        <Stack
          direction='column'
          alignItems='flex-start'
          justifyContent='center'
        >
          <Box>
            <Typography color='text.primary' fontWeight={600} sx={titleStyle}>
              {product.name}
            </Typography>
          </Box>

          <Typography variant='caption' color='text.primary'>
            💵 {formatNumberToVND(product.latestAuction?.currentPrice || 0)}
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}

export default ProductShortRow
