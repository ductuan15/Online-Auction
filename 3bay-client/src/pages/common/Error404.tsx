import * as React from 'react'
import { FC } from 'react'
import HomeLayout from '../../components/layout/HomeLayout'
import { CardMedia, Grid } from '@mui/material'

const Error404: FC = () => {
  return (
    <HomeLayout>
      <Grid container display='flex' alignItems='center' flexDirection='column'>
        <Grid item maxWidth='sm'>
          <CardMedia
            component='img'
            image='https://http.cat/404'
            alt='Not found'
          />
        </Grid>
      </Grid>
    </HomeLayout>
  )
}

export default Error404
