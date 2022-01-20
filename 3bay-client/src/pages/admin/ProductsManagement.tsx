import * as React from 'react'
import { useCallback, useState } from 'react'
import { Alert, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import useTitle from '../../hooks/use-title'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { setErrorTextMsg } from '../../utils/error'
import { useDebounce, useIsMounted } from '../../hooks'
import ProductTable2 from '../../components/admin/products/ProductTable2'
import BorderButton from '../../components/common/button/BorderButton'
import RefreshIcon from '@mui/icons-material/Refresh'

const ProductsManagement = (): JSX.Element => {
  useTitle('3bay | Manage products')
  const [isLoading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [shouldLoading, setShouldLoading] = useState(false)
  const shouldLoadingDebounce = useDebounce(shouldLoading, 500)
  const isMounted = useIsMounted()

  const onLoadingData = useCallback(() => {
    if (isMounted()) {
      setLoading(true)
      setShouldLoading(false)
    }
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
        setShouldLoading(false)
      }
    },
    [isMounted],
  )

  const onRefreshButtonClicked = useCallback(() => {
    setShouldLoading(true)
  }, [])

  return (
    <Grid
      container
      marginBottom={2}
      spacing={2}
      justifyContent='center'
    >
      <Grid
        xs={12}
        item
        container
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
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

        <BorderButton color='info' onClick={onRefreshButtonClicked}>
          <RefreshIcon color='inherit' />
          Refresh
        </BorderButton>
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
          shouldReload={shouldLoadingDebounce}
        />
      </Grid>
    </Grid>
  )
}

export default ProductsManagement
