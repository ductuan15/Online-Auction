import * as React from 'react'
import { Grid, Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

const UserWithRatingSkeleton = (): JSX.Element => {
  const minSize = '40px'

  const theme = useTheme()

  return (
    <Box
      display='flex'
      alignItems='center'
      flexDirection='row'
      my={1}
      minHeight={minSize}
    >
      <Skeleton
        variant='text'
        sx={{
          height: `${theme.typography.body1.lineHeight || 1}rem`,
          width: '20px'
        }}
      />

      {/*Bidder with highest price*/}
      <Skeleton
        variant='circular'
        sx={{
          mx: 1,
          width: minSize,
          height: minSize,
        }}
      />

      <Skeleton
        variant='text'
        sx={{
          height: `${theme.typography.body1.lineHeight || 1}rem`,
          width: 1
        }}
      />
    </Box>
  )
}

const ProductInfoSkeleton = (): JSX.Element | null => {
  const theme = useTheme()

  return (
    <Grid container xs={12} flexDirection='row'>
      <Grid item xs={12}>
        <Skeleton
          variant='text'
          sx={{
            height: `${theme.typography.h4.lineHeight || 1}rem`,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Skeleton variant='text' />
      </Grid>

      <Grid item xs={12}>
        <Skeleton
          variant='text'
          sx={{
            height: `${theme.typography.body1.lineHeight || 1}rem`,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Skeleton
          variant='text'
          sx={{
            height: `${theme.typography.h3.lineHeight || 1}rem`,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Skeleton
          variant='text'
          sx={{
            height: `${theme.typography.subtitle1.lineHeight || 1}rem`,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <UserWithRatingSkeleton />
      </Grid>

      <Grid item xs={12}>
        <UserWithRatingSkeleton />
      </Grid>

      <Grid
        item
        container
        xs={12}
        alignItems='center'
        justifyContent='space-between'
        flexDirection='row'
        mt={1}
      >
        <Grid item xs={12} sm={6}>
          <Skeleton
            variant='text'
            sx={{
              height: `${theme.typography.body1.lineHeight || 1}rem`,
              width: 0.8
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Skeleton
            variant='text'
            sx={{
              height: `${theme.typography.body1.lineHeight || 1}rem`,
              width: 1
            }}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} justifyContent='flex-end' mt={1}>
        <Grid item xs={12} sm={'auto'}>
          <Skeleton
            variant='rectangular'
            sx={{
              height: `${theme.typography.button.lineHeight || 1}rem`,
              width: `60px`,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductInfoSkeleton
