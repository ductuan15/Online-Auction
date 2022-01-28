import Card from '@mui/material/Card'
import {
  Box,
  CardActionArea,
  CardActions,
  CardHeader,
  IconButton,
  Skeleton,
} from '@mui/material'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import ProductCardContentSkeleton from './ProductCardContentSkeleton'
import { useUserContext } from '../../../contexts/user/UserContext'

const imageSx: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.up('xs')]: {
    height: 200,
  },
  [theme.breakpoints.up('md')]: {
    height: 240,
  },
  [theme.breakpoints.up('lg')]: {
    height: 256,
  },
  overflow: 'hidden',
})

const cardStyle: SxProps<Theme> = (theme) => ({
  '&:hover': {
    borderColor: theme.palette.primary.dark,
  },
  borderWidth: `2px`,
})

const cardActionArea: SxProps = {
  '.MuiCardActionArea-focusHighlight': {
    bgcolor: 'transparent',
  },
}

const ProductCardSkeleton = (): JSX.Element => {
  const {
    state: { userDetails },
  } = useUserContext()

  return (
    <Card variant='outlined' sx={cardStyle}>
      <CardActionArea sx={cardActionArea} component='div'>
        <Box sx={imageSx}>
          <Skeleton
            variant='rectangular'
            sx={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>

        <CardHeader
          title={
            <Skeleton
              variant='rectangular'
              sx={(theme) => ({
                height: `${+(theme.typography.h6.lineHeight || 0) * 2.5}rem`,
              })}
            />
          }
          sx={{ pb: 0 }}
        />

        <ProductCardContentSkeleton sx={{ pt: 1 }} />

        {userDetails && (
          <CardActions
            disableSpacing
            sx={{
              pt: 0,
            }}
          >
            <IconButton aria-label='add to watchlist' color='inherit'>
              <FavoriteBorderOutlinedIcon />
            </IconButton>
          </CardActions>
        )}
      </CardActionArea>
    </Card>
  )
}

export default ProductCardSkeleton
