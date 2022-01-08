import { useTheme } from '@mui/material/styles'
import {
  MouseEventHandler,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useUserContext } from '../../../contexts/user/UserContext'
import _ from 'lodash'
import {
  addToWatchList,
  deleteProdWatchList,
} from '../../../services/product.service'
import Product from '../../../models/product'
import ProductRow from './ProductRow'
import ProductCard from './ProductCard'

type ProductItemProps = {
  product: Product
  cardStyle?: 'row' | 'card'
}

export default function ProductItem({
  product,
  cardStyle,
}: ProductItemProps): JSX.Element {
  const theme = useTheme()
  const [scale, setScale] = useState(1.0)
  const [color, setColor] = useState<string>(theme.palette.text.primary)
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
  } | null>(null)

  const {
    dispatch,
    state: { watchlist, userDetails },
  } = useUserContext()

  const isInWatchlist = useMemo(() => {
    const prodIndex = _.findIndex(watchlist, function (p) {
      return p.id === product.id
    })
    return prodIndex !== -1
  }, [product.id, watchlist])

  const toggleWatchlistButton = useCallback(
    async (e: SyntheticEvent) => {
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
    },
    [dispatch, isInWatchlist, product],
  )

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      if (userDetails) {
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
    },
    [contextMenu, userDetails],
  )

  const handleContextMenuClose = useCallback(
    async (e: SyntheticEvent) => {
      e.stopPropagation()
      setContextMenu(null)
      await toggleWatchlistButton(e)
    },
    [toggleWatchlistButton],
  )

  useEffect(() => {
    setColor(theme.palette.text.primary)
  }, [theme])

  const onMouseOver = useCallback(() => {
    setColor(theme.palette.primary.dark)
    setScale(1.1)
  }, [theme.palette.primary.dark])

  const onMouseOut = useCallback(() => {
    setColor(theme.palette.text.primary)
    setScale(1.0)
  }, [theme.palette.text.primary])

  return cardStyle === 'row' ? (
    <ProductRow
      product={product}
      toggleWatchlistButton={toggleWatchlistButton}
      handleContextMenu={handleContextMenu}
      handleContextMenuClose={handleContextMenuClose}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      isInWatchlist={isInWatchlist}
      scale={scale}
      color={color}
      contextMenu={contextMenu}
    />
  ) : (
    <ProductCard
      product={product}
      toggleWatchlistButton={toggleWatchlistButton}
      handleContextMenu={handleContextMenu}
      handleContextMenuClose={handleContextMenuClose}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      isInWatchlist={isInWatchlist}
      scale={scale}
      color={color}
      contextMenu={contextMenu}
    />
  )
}  