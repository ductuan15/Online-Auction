import * as React from 'react'
import { CardMedia, Grid } from '@mui/material'
import useTitle from '../../../hooks/use-title'

const Error404 = (): JSX.Element => {
  useTitle('3bay | Page not found')
  return (
    <Grid container display='flex' alignItems='center' flexDirection='column'>
      <Grid item maxWidth='sm'>
        <CardMedia
          component='img'
          image='https://http.cat/404'
          alt='Not found'
        />
      </Grid>
    </Grid>
  )
}

export default Error404
