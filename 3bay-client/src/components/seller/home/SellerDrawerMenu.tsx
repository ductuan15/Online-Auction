import { useAuth } from '../../../contexts/user/AuthContext'
import { Divider, List } from '@mui/material'
import * as React from 'react'
import StyledMenuItem from '../../common/menu/StyledMenuItem'
import StyledListSubheader from '../../common/drawer/StyledListSubheader'

export const SELLER_MENU_ITEMS = [
  {
    title: '🧰️ Posted product list',
    link: '/seller/posted-product-list',
  },
  {
    title: '👑 Auctions have winner',
    link: '/seller/auctions-have-winner',
  },
  {
    title: '📦 New product',
    link: '/product/create',
  },
]

const SellerDrawerMenu = (): JSX.Element | null => {
  const { user } = useAuth()
  if (!user || user.role !== 'SELLER') {
    return null
  }

  return (
    <List
      aria-labelledby='seller-list-subheader'
      subheader={
        <StyledListSubheader id='seller-list-subheader'>
          📦 Seller
        </StyledListSubheader>
      }
    >
      <Divider variant='middle' />
      {SELLER_MENU_ITEMS.map((item) => {
        return (
          <StyledMenuItem
            to={item.link}
            text={item.title}
            key={item.title}
            sx={{ mx: 1 }}
          />
        )
      })}
    </List>
  )
}

export default SellerDrawerMenu
