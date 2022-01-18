import Card from '@mui/material/Card'
import { Box, CardActionArea, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { SxProps } from '@mui/system'
import { Theme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import ProductCardContent from '../product-card/ProductCardContent'
import { useUserContext } from '../../../contexts/user/UserContext'
import { CardProps } from '../product-card/ProductCard'
import ProductHeaderRow from './ProductHeaderRow'
import ProductCardThumbnail from '../product-card/ProductCardThumbnail'

type CardRow = CardProps

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

const ProductRow = ({
  product,
  toggleWatchlistButton,
  onMouseOver,
  onMouseOut,
  isInWatchlist,
  isSelected,
}: CardRow): JSX.Element => {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only('xs'))

  const {
    state: { userDetails },
  } = useUserContext()

  return (
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
          <ProductCardThumbnail
            isSelected={isSelected}
            boxSx={imageSx as SxProps}
            product={product}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}
          >
            <ProductHeaderRow
              name={product.name}
              color={isSelected ? 'primary.dark' : 'auto'}
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
  )
}

export default ProductRow
