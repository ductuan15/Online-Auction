import {
  MouseEventHandler,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
import { Theme, useTheme } from '@mui/material/styles'
import ProductCardContent from './ProductCardContent'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import {
  addToWatchList,
  deleteProdWatchList,
} from '../../../services/product.service'
import _ from 'lodash'
import { useUserContext } from '../../../contexts/user/UserContext'

type CardProps = {
  product: Product
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

// TODO: reactor me
// TODO: extract the countdown logic
const ProductCard = ({ product }: CardProps): JSX.Element => {
  const theme = useTheme()
  const [scale, setScale] = useState(1.0)
  const [color, setColor] = useState<string>(theme.palette.text.primary)
  // const interval = useRef<NodeJS.Timer>()
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
  } | null>(null)
  const { dispatch } = useUserContext()

  const {
    state: { watchlist },
  } = useUserContext()

  const isInWatchlist = useMemo(() => {
    const prodIndex = _.findIndex(watchlist, function (p) {
      return p.id === product.id
    })
    return prodIndex !== -1
  }, [product.id, watchlist])

  const toggleWatchlistButton = async (e: SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWatchlist) {
      const res = await deleteProdWatchList(product.id)
      dispatch({
        type: 'DELETE_WATCH_LIST',
        payload: res.data.productId,
      })
    } else {
      await addToWatchList(product.id)
      dispatch({
        type: 'ADD_WATCH_LIST',
        payload: product,
      })
    }
  }
  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    )
  }

  const handleContextMenuClose = async (e: SyntheticEvent) => {
    e.stopPropagation()
    await toggleWatchlistButton(e)
    setContextMenu(null)
  }

  useEffect(() => {
    setColor(theme.palette.text.primary)
  }, [theme])

  const onMouseOver = () => {
    setColor(theme.palette.primary.dark)
    setScale(1.1)
  }
  const onMouseOut = () => {
    setColor(theme.palette.text.primary)
    setScale(1.0)
  }

  return (
    <div onContextMenu={handleContextMenu}>
      <Tooltip title={product.name}>
        <Card
          variant='outlined'
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          sx={(theme) => ({
            '&:hover': {
              borderColor: theme.palette.primary.dark,
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
              }}
              component='div'
            >
              <Box sx={imageSx}>
                <CardMedia
                  component='img'
                  image={product.thumbnails.lg || ''}
                  sx={{
                    width: '100%',
                    height: '100%',
                    transition: `transform .3s`,
                    transform: `scale(${scale})`,
                  }}
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
                      sx={{ ...titleSx }}
                    >
                      {product.name || ' '}
                    </Typography>
                  </Box>
                }
                sx={{ pb: 0 }}
              />

              <ProductCardContent product={product} sx={{ pt: 1 }} />
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
            </CardActionArea>
          </Link>
        </Card>
      </Tooltip>

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
          <MenuItem onClick={handleContextMenuClose}>Add to watchlist</MenuItem>
        ) : (
          <MenuItem onClick={handleContextMenuClose}>
            Remove from watchlist
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}

export default ProductCard
