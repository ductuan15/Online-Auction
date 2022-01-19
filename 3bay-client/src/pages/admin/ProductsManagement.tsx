import * as React from 'react'
import { useCallback, useState } from 'react'
import { Alert, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useTitle from '../../hooks/use-title'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { setErrorTextMsg } from '../../utils/error'
import { useIsMounted } from '../../hooks'
import ProductTable2 from '../../components/admin/products/ProductTable2'

const ProductsManagement = (): JSX.Element => {
  useTitle('3bay | Manage products')
  const [isLoading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const isMounted = useIsMounted()

  const onLoadingData = useCallback(() => {
    if (isMounted()) setLoading(true)
  }, [isMounted])

  const onDataLoaded = useCallback(() => {
    if (isMounted()) {
      setErrorText(null)
      setLoading(false)
    }
  }, [isMounted])

  const onTableError = useCallback(
    (e: unknown) => {
      if (isMounted()) {
        setErrorTextMsg(e, setErrorText)
        setLoading(false)
      }
    },
    [isMounted],
  )

  return (
    <Grid
      container
      marginTop={1}
      marginBottom={2}
      spacing={1}
      justifyContent='between'
    >
      <Grid display='flex' xs={12} item alignItems='center'>
        <Typography
          color='text.primary'
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              typography: 'h5',
            },
            typography: 'h3',
          })}
        >
          <ShoppingCartOutlinedIcon fontSize='large' sx={{ mr: 2 }} />
          Manage Products
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
      </Grid>

      <Grid
        item
        container
        xs={12}
        justifyContent='center'
        flexDirection='column'
      >
        {errorText && (
          <Alert severity='error' sx={{ my: 2 }}>
            {errorText}
          </Alert>
        )}
        {/*{isLoading && <LinearProgress variant='indeterminate' />}*/}

        {/*<ProductTable*/}
        {/*  onLoadingData={onLoadingData}*/}
        {/*  onDataLoaded={onDataLoaded}*/}
        {/*  onError={onTableError}*/}
        {/*/>*/}
        <ProductTable2
          onLoadingData={onLoadingData}
          onDataLoaded={onDataLoaded}
          onError={onTableError}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  )
}

export default ProductsManagement
