import * as React from 'react'
import { Container, Grid, Paper } from '@mui/material'
import CreateProductForm from '../../../components/seller/product/CreateProductForm'
import Typography from '@mui/material/Typography'

export default function CreateProduct(): JSX.Element {
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
      >
        📦 Create a Product
      </Typography>

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
          <CreateProductForm />
        </Grid>
      </Container>
    </Container>
  )
}
