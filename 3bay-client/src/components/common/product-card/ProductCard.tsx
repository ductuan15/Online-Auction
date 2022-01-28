import { SyntheticEvent } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import {
  Box,
  CardActionArea,
  CardActions,
  CardHeader,
  IconButton,
  Link,
  Tooltip,
  TypographyStyle,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Product from '../../../models/product'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'
import ProductCardContent from './ProductCardContent'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { useUserContext } from '../../../contexts/user/UserContext'
import ProductCardThumbnail from './ProductCardThumbnail'

export type CardProps = {
  product: Product
  toggleWatchlistButton: (e: SyntheticEvent) => void
  onMouseOver: () => void
  onMouseOut: () => void
  isInWatchlist: boolean
  isSelected: boolean
}

const titleStyle: TypographyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const titleSx: SxProps = {
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: 'normal',
}

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

const cardSx: SxProps<Theme> = (theme) => ({
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    boxShadow: 3,
  },
  borderWidth: `2px`,
})

const cardAreaSx: SxProps = {
  '.MuiCardActionArea-focusHighlight': {
    bgcolor: 'transparent',
  },
}

const cardActionSx: SxProps = {
  pt: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const ProductCard = ({
  product,
  toggleWatchlistButton,
  onMouseOver,
  onMouseOut,
  isInWatchlist,
  isSelected,
}: CardProps): JSX.Element => {
  const {
    state: { userDetails },
  } = useUserContext()

  return (
    <Tooltip title={product.name}>
      <Card
        variant='outlined'
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        sx={cardSx}
      >
        <Link
          color='inherit'
          underline='none'
          component={RouterLink}
          to={`/product/${product.id}`}
          style={{ cursor: 'context-menu' }}
        >
          <CardActionArea sx={cardAreaSx} component='div'>
            <ProductCardThumbnail
              isSelected={isSelected}
              boxSx={imageSx as SxProps}
              product={product}
              imageSx={{
                width: '100%',
                height: '100%',
              }}
            />

            <CardHeader
              title={
                <Box
                  sx={(theme) => ({
                    height: `${
                      +(theme.typography.h6.lineHeight || 0) * 2.5
                    }rem`,
                  })}
                >
                  <Typography
                    variant='h6'
                    style={titleStyle}
                    color={isSelected ? 'primary.dark' : 'auto'}
                    sx={titleSx}
                  >
                    {product.name || ' '}
                  </Typography>
                </Box>
              }
              sx={{ pb: 0 }}
            />

            <ProductCardContent product={product} sx={{ pt: 1 }} />
            {userDetails && (
              <CardActions disableSpacing sx={cardActionSx}>
                <IconButton
                  aria-label='add to watchlist'
                  color='inherit'
                  onClick={toggleWatchlistButton}
                >
                  {isInWatchlist ? (
                    <FavoriteOutlinedIcon />
                  ) : (
                    <FavoriteBorderOutlinedIcon />
                  )}
                </IconButton>
              </CardActions>
            )}
          </CardActionArea>
        </Link>
      </Card>
    </Tooltip>
  )
}

export default ProductCard
