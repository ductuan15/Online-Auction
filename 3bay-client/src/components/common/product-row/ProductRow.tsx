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
  Stack,
  Typography,
  TypographyStyle,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { SxProps } from '@mui/system'
import { Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import ProductCardContent from '../product-card/ProductCardContent'
import { useUserContext } from '../../../contexts/user/UserContext'
import { CardProps } from '../product-card/ProductCard'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { SyntheticEvent } from 'react'
import { UserDetails } from '../../../models/user'

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
  fontWeight: 600,
  lineHeight: 'normal',
  '&:hover': {
    color: theme.palette.primary.dark,
  },
})

export const imageSx: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.up('xs')]: {
    width: 120,
    height: 120,
    overflow: 'visible',
  },
  [theme.breakpoints.up('sm')]: {
    width: 175,
    height: 175,
  },
  [theme.breakpoints.up('lg')]: {
    width: 200,
    height: 200,
  },
  width: 250,
  height: 250,
})

const CardHeaderRow = ({
  name,
  color,
  xsScreen,
  toggleWatchlistButton,
  userDetails,
  isInWatchlist,
}: {
  name: string
  color: string
  xsScreen: boolean
  toggleWatchlistButton: (e: SyntheticEvent) => void
  userDetails?: UserDetails
  isInWatchlist: boolean
}): JSX.Element => {
  return (
    <CardHeader
      title={
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Typography
            variant={xsScreen ? 'body1' : 'h6'}
            style={titleStyle}
            color={color}
            sx={titleSx}
          >
            {name || ' '}
          </Typography>
          {userDetails && (
            <Box>
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
        </Stack>
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
                  width: 'inherit',
                  height: 'inherit',
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
                toggleWatchlistButton={toggleWatchlistButton}
                userDetails={userDetails}
                isInWatchlist={isInWatchlist}
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
