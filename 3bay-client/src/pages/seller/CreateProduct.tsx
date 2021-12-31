import * as React from 'react'
import { useState } from 'react'
import { Alert, Container, Grid, LinearProgress, Paper } from '@mui/material'
import CreateProductForm from '../../components/seller/product/CreateProductForm'
import Typography from '@mui/material/Typography'
import { setErrorTextMsg } from '../../utils/error'
import { useNavigate } from 'react-router-dom'
import SellerService from '../../services/seller.service'
import { useIsMounted } from '../../hooks'

export default function CreateProduct(): JSX.Element {
  const [errorText, setErrorText] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)

  const onError = (e: unknown) => {
    setErrorTextMsg(e, setErrorText)
  }

  const navigate = useNavigate()
  const isMounted = useIsMounted()

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true)
      const response = await SellerService.addNewProduct(formData)
      navigate(`/product/${response.data.product.id}`)
    } catch (e) {
      window.scrollTo(0, 0)
      setErrorTextMsg(e, setErrorText)
    } finally {
      if (isMounted()) {
        setLoading(false)
      }
    }
  }

  return (
    <Container maxWidth='lg' sx={{ my: 2 }}>
      <Typography
        color='text.primary'
        fontWeight={600}
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            typography: 'h4',
          },
          typography: 'h3',
        })}
        gutterBottom
      >
        📦 Create a Product
      </Typography>

      {errorText && <Alert severity='error'>{errorText}</Alert>}

      <Container
        component={Paper}
        variant='outlined'
        sx={{
          p: 2,
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          my: 2,
        }}
      >
        <Grid container maxWidth='md'>
          <CreateProductForm onError={onError} onSubmit={onSubmit} />
        </Grid>
      </Container>

      {isLoading && <LinearProgress variant='indeterminate' />}
    </Container>
  )
}
