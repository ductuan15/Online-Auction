import Box from '@mui/material/Box'
import Product from '../../../models/product'
import { Grid, Stack } from '@mui/material'
import ProductItem from './ProductItem'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'

interface ProductListProps {
  items: Product[]
}

const ProductList = (props: ProductListProps): JSX.Element => {
  const {
    state: { listLayout },
  } = useLayoutContext()

  return (
    <Box sx={{ flexGrow: 1 }}>
      {listLayout === 'row' ? (
        <Stack direction='column' spacing={2}>
          {props.items.map((product) => {
            return (
              <ProductItem product={product} key={product.id} cardStyle='row' />
            )
          })}
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {props.items.map((product) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductItem product={product} />
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
export default ProductList
