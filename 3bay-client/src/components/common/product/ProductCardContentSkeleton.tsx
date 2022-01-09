import { SxProps } from '@mui/system'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import { Box, Skeleton } from '@mui/material'

type CardContentProps = {
  sx?: SxProps
}

function ProductCardContentSkeleton({ sx }: CardContentProps): JSX.Element {
  const theme = useTheme()
  return (
    <CardContent component={Box} display='flex' flexDirection='column' sx={sx}>
      {/* Current price */}
      <Skeleton
        variant='text'
        sx={(theme) => ({
          height: `${+(theme.typography.body1.lineHeight || 0)}rem`,
        })}
      />

      {/* Buy out price */}
      <Skeleton
        variant='text'
        sx={(theme) => ({
          height: `${theme.typography.caption.lineHeight}em`,
        })}
      />

      <Box
        display='flex'
        alignItems='center'
        flexDirection='row'
        my={1}
        minHeight={25}
      >
        <Skeleton variant='text' width='auto' />

        {/*<Typography variant='body1'>Bid by</Typography>*/}

        {/*Bidder with highest price*/}
        <Skeleton
          variant='circular'
          sx={{
            ml: 1,
            width: `25px`,
            height: `25px`,
          }}
        />

        {/*Display total number of people (excluding 1 person) are currently bidding */}
        {/*{totalBidder >= 0 && (*/}
        {/*  <Typography variant='body2' color='text.secondary'>*/}
        {/*    & <b>{product.latestAuction?._count.bids || 0}</b> other people*/}
        {/*  </Typography>*/}
        {/*)}*/}

        <Skeleton variant='text' sx={{
          ml: 1,
          width: '100%'
        }} />
      </Box>

      <Skeleton
        variant='text'
        sx={{
          height: `${theme.typography.body2.lineHeight}em`,
        }}
      />

      <Skeleton
        variant='text'
        sx={{
          height: `${theme.typography.body2.lineHeight}em`,
        }}
      />
    </CardContent>
  )
}

export default ProductCardContentSkeleton
