import Card from '@mui/material/Card'
import { Box, CardActionArea, CardHeader, Grid } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Skeleton } from '@mui/lab'
import ProductCardContentSkeleton from '../product-card/ProductCardContentSkeleton'
import { imageSx } from './ProductRow'
import { useMemo } from 'react'
import { SxProps } from '@mui/system'

const CardHeaderRow = ({ xsScreen }: { xsScreen?: boolean }): JSX.Element => {
  const theme = useTheme()
  const lineHeight = useMemo(() => {
    return xsScreen
      ? theme.typography.body2.lineHeight
      : theme.typography.h6.lineHeight
  }, [
    theme.typography.body2.lineHeight,
    theme.typography.h6.lineHeight,
    xsScreen,
  ])

  return (
    <CardHeader
      title={
        <Box>
          <Skeleton
            variant='text'
            sx={{
              height: `${lineHeight}em`,
            }}
          />
        </Box>
      }
      sx={
        xsScreen
          ? { pb: 0, pt: 0.75, px: 0.75 }
          : {
              pb: 0,
              pt: 2,
              px: 2,
            }
      }
    />
  )
}

const productCard: SxProps<Theme> = (theme) => ({
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    boxShadow: 3,
  },
  borderWidth: `2px`,
})

const cardActionArea: SxProps = {
  '.MuiCardActionArea-focusHighlight': {
    bgcolor: 'transparent',
  },
  display: 'flex',
  flexDirection: 'row',
}

const cardBox: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}

const ProductRowSkeleton = (): JSX.Element => {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Card variant='outlined' sx={productCard}>
      <CardActionArea sx={cardActionArea} component='div'>
        <Skeleton variant='rectangular' sx={imageSx} />

        <Box sx={cardBox}>
          <Grid item xs={12}>
            <CardHeaderRow xsScreen={xsScreen} />
          </Grid>
          <ProductCardContentSkeleton
            sx={
              xsScreen
                ? { pb: 0, pt: 0.75, px: 0.75 }
                : {
                    pb: 0,
                    pt: 2,
                    px: 2,
                  }
            }
          />
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default ProductRowSkeleton
