import Card from '@mui/material/Card'
import {
  Box,
  CardActionArea,
  CardHeader,
  CardMedia,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
  TypographyStyle,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { SxProps } from '@mui/system'
import { Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import ProductCardContent from './ProductCardContent'
import { useUserContext } from '../../../contexts/user/UserContext'
import { CardProps } from './ProductCard'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

type CardRow = CardProps

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
    color: theme.palette.primary.dark,
  },
})

const imageSx: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.only('xs')]: {
    width: 120,
    height: 120,
    overflow: 'visible',
  },
  [theme.breakpoints.up('xs')]: {
    width: 175,
  },
  [theme.breakpoints.up('lg')]: {
    width: 200,
  },
  [theme.breakpoints.up('xl')]: {
    width: 200,
  },
  overflow: 'hidden',
})

const CardHeaderRow = ({
  name,
  color,
  xsScreen,
}: {
  name: string
  color: string
  xsScreen: boolean
}): JSX.Element => {
  return (
    <CardHeader
      title={
        <Box>
          <Typography
            variant={xsScreen ? 'body1' : 'h6'}
            style={titleStyle}
            fontWeight={600}
            color={color}
            sx={titleSx}
          >
            {name || ' '}
          </Typography>
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

// TODO: reactor me
const ProductRow = ({
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
}: CardRow): JSX.Element => {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only('xs'))

  const {
    state: { userDetails },
  } = useUserContext()

  return (
    <div onContextMenu={handleContextMenu}>
      <Card
        variant='outlined'
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        sx={(theme) => ({
          '&:hover': {
            borderColor: theme.palette.primary.dark,
            boxShadow: 3,
          },
          borderWidth: `2px`,
        })}
      >
        <Link
          color='inherit'
          underline='none'
          component={RouterLink}
          to={`/product/${product.id}`}
          style={{ cursor: 'context-menu' }}
        >
          <CardActionArea
            sx={{
              '.MuiCardActionArea-focusHighlight': {
                bgcolor: 'transparent',
              },
              display: 'flex',
            }}
            component='div'
          >
            <Box sx={imageSx}>
              <CardMedia
                component='img'
                image={product.thumbnails.md || ''}
                sx={{
                  width: xsScreen ? 120 : '100%',
                  height: xsScreen ? 120 : '100%',
                  transition: `transform .3s`,
                  transform: `scale(${scale})`,
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <CardHeaderRow
                name={product.name}
                color={color}
                xsScreen={xsScreen}
              />
              <ProductCardContent
                product={product}
                sx={
                  xsScreen
                    ? { pb: 0, pt: 0.75, px: 0.75 }
                    : {
                        pb: 0,
                        pt: 2,
                        px: 2,
                      }
                }
                rowMode
              />
              {userDetails && (
                <Box
                  sx={
                    xsScreen
                      ? { pb: 0 }
                      : {
                          py: 0.75,
                          px: 1,
                        }
                  }
                >
                  <IconButton
                    aria-label='add to watchlist'
                    color='inherit'
                    size='small'
                    onClick={toggleWatchlistButton}
                  >
                    {isInWatchlist ? (
                      <FavoriteOutlinedIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </IconButton>
                </Box>
              )}
            </Box>
          </CardActionArea>
        </Link>
      </Card>

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

export default ProductRow
