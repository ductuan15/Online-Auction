import { MouseEventHandler, SyntheticEvent } from 'react'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {
  Box,
  CardActionArea,
  CardActions,
  CardHeader,
  IconButton,
  Link,
  Menu,
  MenuItem,
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

export type CardProps = {
  product: Product
  toggleWatchlistButton: (e: SyntheticEvent) => void
  handleContextMenu: MouseEventHandler<HTMLDivElement>
  handleContextMenuClose: (e: SyntheticEvent) => void
  onMouseOver: () => void
  onMouseOut: () => void
  isInWatchlist: boolean
  scale: number
  color: string
  contextMenu: {
    mouseX: number
    mouseY: number
  } | null
}

const titleStyle: TypographyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const titleSx: SxProps<Theme> = (theme) => ({
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'normal',
  '&:hover': {
    color: theme.palette.secondary.dark,
  },
})

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

const cardAreaSx = {
  '.MuiCardActionArea-focusHighlight': {
    bgcolor: 'transparent',
  },
}

const cardMediaSx = (scale: number) => ({
  width: '100%',
  height: '100%',
  transition: `transform .3s`,
  transform: `scale(${scale})`,
})

const ProductCard = ({
  product,
  toggleWatchlistButton,
  handleContextMenu,
  handleContextMenuClose,
  onMouseOver,
  onMouseOut,
  isInWatchlist,
  scale,
  color,
  contextMenu,
}: CardProps): JSX.Element => {
  const {
    state: { userDetails },
  } = useUserContext()

  return (
    <div onContextMenu={handleContextMenu}>
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
              <Box sx={imageSx} position='relative'>
                <CardMedia
                  component='img'
                  image={product.thumbnails.md || ''}
                  sx={cardMediaSx(scale)}
                />
              </Box>

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
                      color={color}
                      sx={{
                        ...titleSx,
                      }}
                    >
                      {product.name || ' '}
                    </Typography>
                  </Box>
                }
                sx={{ pb: 0 }}
              />

              <ProductCardContent product={product} sx={{ pt: 1 }} />
              {userDetails && (
                <CardActions
                  disableSpacing
                  sx={{
                    pt: 0,
                  }}
                >
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

      {userDetails && (
        <Menu
          open={contextMenu !== null}
          onClose={handleContextMenuClose}
          anchorReference='anchorPosition'
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {!isInWatchlist ? (
            <MenuItem onClick={handleContextMenuClose}>
              Add to watchlist
            </MenuItem>
          ) : (
            <MenuItem onClick={handleContextMenuClose}>
              Remove from watchlist
            </MenuItem>
          )}
        </Menu>
      )}
    </div>
  )
}

export default ProductCard
