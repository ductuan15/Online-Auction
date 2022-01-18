import {Grid, Stack} from '@mui/material'
import {useLayoutContext} from '../../../contexts/layout/LayoutContext'
import ProductItemSkeleton from './ProductItemSkeleton'

const ProductList = (): JSX.Element => {
  const {
    state: {listLayout},
  } = useLayoutContext()

  return (
    <>
      {listLayout === 'row' ? (
        <Stack direction='column' spacing={2}>
          {[1, 2, 3, 4].map((i) => {
            return <ProductItemSkeleton cardStyle={listLayout} key={i}/>
          })}
        </Stack>
      ) : (
        <Grid container justifyContent='center' spacing={2}>
          {[1, 2, 3, 4].map((i) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <ProductItemSkeleton cardStyle={listLayout}/>
              </Grid>
            )
          })}
        </Grid>
      )}
    </>
  )
}
export default ProductList
