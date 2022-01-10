import Product from '../../../models/product'
import { Grid, Stack, Typography, TypographyStyle } from '@mui/material'
import ChangeLayoutButtonGroup from '../button/ChangeLayoutButtonGroup'
import ProductListSkeleton from './ProductListSkeleton'
import ProductList from './ProductList'
import { useMemo } from 'react'

const titleStyle: TypographyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
}

type ProductListLayoutProps = {
  items: Product[]
  isLoading?: boolean
  // render when items.length === 0
  emptyListComponent?: JSX.Element
  titleComponent?: JSX.Element | string
}

const ProductListLayout = ({
  items,
  titleComponent,
  isLoading,
  emptyListComponent,
}: ProductListLayoutProps): JSX.Element => {
  const content = useMemo(() => {
    if (isLoading) {
      return <ProductListSkeleton />
    } else if (items.length === 0) {
      return emptyListComponent ? (
        emptyListComponent
      ) : (
        <Typography
          color='text.primary'
          variant='h4'
          fontWeight={600}
          textAlign='center'
          gutterBottom
        >
          Empty results :(
        </Typography>
      )
    } else {
      return <ProductList items={items} />
    }
  }, [emptyListComponent, isLoading, items])

  return (
    <Grid item container xs={12} minHeight={400}>
      <Grid item xs={12} sx={{ my: 1 }} minHeight={400}>
        <Stack
          spacing={2}
          direction='row'
          alignContent='center'
          justifyContent='space-between'
          sx={{ my: 1 }}
        >
          {titleComponent && typeof titleComponent === 'string' && (
            <Typography
              color='text.primary'
              variant='h4'
              fontWeight={600}
              sx={titleStyle}
            >
              {titleComponent}
            </Typography>
          )}
          {titleComponent && typeof titleComponent !== 'string' && (
            <>{titleComponent}</>
          )}
          <ChangeLayoutButtonGroup />
        </Stack>
        {content}
      </Grid>
    </Grid>
  )
}
export default ProductListLayout
