import Product from '../../../models/product'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, ListItemButton, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ProductShortRow from '../product-row/ProductShortRow'
import { SxProps } from '@mui/system'

type ShortProductListProps = {
  title: string
  productService?: () => Promise<Product[]>
  detailPage?: string
  maxItems?: number
}

const DEFAULT_N_ITEMS = 3

const gridContainerStyle: SxProps = {
  border: `2px solid rgba(145, 158, 171, 0.24)`,
  borderRadius: `8px`,
  minHeight: 150,
}

const ProductShortList = ({
  title,
  productService,
  detailPage,
  maxItems,
}: ShortProductListProps): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const data = await productService?.()
        if (data) {
          setProducts(data)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [productService])

  const navigateToDetails = useCallback(() => {
    if (detailPage) {
      navigate(detailPage)
    }
  }, [detailPage, navigate])

  return (
    <Grid item xs={12} sm={6} flexDirection={'column'}>
      <Typography variant='h6' color='text.primary' gutterBottom>
        {title}
      </Typography>

      <Grid
        item
        xs={12}
        container
        sx={gridContainerStyle}
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        {products.length === 0 ? (
          <Typography color='text.secondary'>📦 No item</Typography>
        ) : (
          <>
            {products.slice(0, maxItems ?? DEFAULT_N_ITEMS).map((product) => {
              return (
                <Grid item xs={12} key={product?.id} sx={{ width: 1 }}>
                  <ListItemButton divider sx={{ width: 1 }}>
                    <ProductShortRow product={product} />
                  </ListItemButton>
                </Grid>
              )
            })}

            {products.length > (maxItems ?? DEFAULT_N_ITEMS) && (
              <ListItemButton onClick={navigateToDetails} sx={{ width: 1 }}>
                <Grid
                  container
                  flexDirection='row'
                  justifyContent='space-between'
                  alignItems='center'
                  py={1}
                >
                  <Typography color='text.primary' fontWeight={600} noWrap>
                    View more
                  </Typography>

                  <NavigateNextIcon sx={{ color: 'text.primary' }} />
                </Grid>
              </ListItemButton>
            )}
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default ProductShortList
