import * as React from 'react'
import {useState} from 'react'
import {Alert, Container, Grid, Paper} from '@mui/material'
import CreateProductForm from '../../../components/seller/product/CreateProductForm'
import Typography from '@mui/material/Typography'
import {setErrorTextMsg} from '../../../utils/error'

export default function CreateProduct(): JSX.Element {
  const [errorText, setErrorText] = useState<string | null>(null)

  const onError = (e: unknown) => {
    setErrorTextMsg(e, setErrorText)
  }

  return (
    <Container maxWidth='lg' sx={{my: 2}}>
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
          <CreateProductForm onError={onError}/>
        </Grid>
      </Container>
    </Container>
  )
}
