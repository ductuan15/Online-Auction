import {
  MouseEventHandler,
  SyntheticEvent,
  useCallback,
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
import ProductRow from '../product-row/ProductRow'
import ProductCard from '../product-card/ProductCard'
import { Menu, MenuItem } from '@mui/material'

type ProductItemProps = {
  product: Product
  cardStyle?: 'row' | 'card'
}

export default function ProductItem({
  product,
  cardStyle,
}: ProductItemProps): JSX.Element {
  const [isSelected, setSelected] = useState(false)
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

  const onMouseOver = useCallback(() => {
    setSelected(true)
  }, [])

  const onMouseOut = useCallback(() => {
    setSelected(false)
  }, [])

  return (
    <div onContextMenu={handleContextMenu}>
      {cardStyle === 'row' ? (
        <ProductRow
          product={product}
          toggleWatchlistButton={toggleWatchlistButton}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          isInWatchlist={isInWatchlist}
          isSelected={isSelected}
        />
      ) : (
        <ProductCard
          product={product}
          toggleWatchlistButton={toggleWatchlistButton}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          isInWatchlist={isInWatchlist}
          isSelected={isSelected}
        />
      )}

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