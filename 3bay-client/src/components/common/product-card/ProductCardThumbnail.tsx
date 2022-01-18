import { SxProps } from '@mui/system'
import { Box, CardMedia } from '@mui/material'
import moment from 'moment'
import NewLabel from '../chip/NewLabel'
import Product from '../../../models/product'

type ProductCardThumbnailProps = {
  isSelected: boolean
  boxSx: SxProps
  imageSx?: SxProps
  product: Product
}

const ProductCardThumbnail = ({
  product,
  isSelected,
  boxSx,
  imageSx,
}: ProductCardThumbnailProps): JSX.Element => {
  return (
    <Box sx={boxSx} position='relative'>
      <CardMedia
        component='img'
        image={product.thumbnails.md || ''}
        sx={{
          width: 'inherit',
          height: 'inherit',
          transition: `transform .3s`,
          transform: `scale(${isSelected ? 1.1 : 1.0})`,
          ...imageSx,
        }}
      />
      {moment(product.createdAt).isBetween(moment().add(-1, 'd'), moment()) && (
        <NewLabel isSelected={isSelected} />
      )}
    </Box>
  )
}

export default ProductCardThumbnail
