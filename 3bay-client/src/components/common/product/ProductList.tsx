import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import ProductCard from './ProductCard'
import Product from '../../../models/product'
interface ProductListProps {
  items: Product[]
}

const ProductList = (props: ProductListProps): JSX.Element => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {props.items.map((product) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
export default ProductList
