import Card from '@mui/material/Card'
import { Box, CardActionArea, CardHeader, Grid } from '@mui/material'
import { SxProps } from '@mui/system'
import { Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Skeleton } from '@mui/lab'
import ProductCardContentSkeleton from './ProductCardContentSkeleton'

const imageSx: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.only('xs')]: {
    width: 120,
    height: 120,
    overflow: 'visible',
  },
  [theme.breakpoints.up('xs')]: {
    width: 175,
    height: 175,
  },
  [theme.breakpoints.up('lg')]: {
    width: 200,
    height: 200,
  },

  width: 200,
  height: 200,

  overflow: 'hidden',
})

const CardHeaderRow = ({ xsScreen }: { xsScreen?: boolean }): JSX.Element => {
  const theme = useTheme()
  const lineHeight = xsScreen
    ? theme.typography.body2.lineHeight
    : theme.typography.h6.lineHeight

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

const ProductRowSkeleton = (): JSX.Element => {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Card
      variant='outlined'
      sx={(theme) => ({
        '&:hover': {
          borderColor: theme.palette.primary.dark,
          boxShadow: 3,
        },
        borderWidth: `2px`,
      })}
    >
      <CardActionArea
        sx={{
          '.MuiCardActionArea-focusHighlight': {
            bgcolor: 'transparent',
          },
          display: 'flex',
          flexDirection: 'row',
        }}
        component='div'
      >
        <Skeleton variant='rectangular' sx={imageSx} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
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
