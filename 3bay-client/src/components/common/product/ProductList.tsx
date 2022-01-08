import Box from '@mui/material/Box'
import Product from '../../../models/product'
import { Stack } from '@mui/material'
import ProductItem from './ProductItem'

interface ProductListProps {
  items: Product[]
}

const ProductList = (props: ProductListProps): JSX.Element => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction='column' spacing={2}>
        {props.items.map((product) => {
          return (
            <ProductItem product={product} key={product.id} cardStyle='row' />
          )
        })}
      </Stack>
    </Box>
  )
}
export default ProductList
