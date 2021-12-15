import * as React from 'react'
import {CardMedia, Grid} from '@mui/material'

const Error404 = (): JSX.Element => {
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
