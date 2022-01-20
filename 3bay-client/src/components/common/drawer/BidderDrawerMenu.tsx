import { Divider, List } from '@mui/material'
import * as React from 'react'
import StyledMenuItem from '../../common/menu/StyledMenuItem'
import StyledListSubheader from '../../common/drawer/StyledListSubheader'
import { useUserContext } from '../../../contexts/user/UserContext'

export const BIDDER_MENU_ITEMS = [
  {
    title: '📝️ Auction list',
    link: '/user/auction-list',
  },
  {
    title: '👑 Won auction list',
    link: '/user/won-auction-list',
  },
]

const BidderDrawerMenu = (): JSX.Element | null => {
  const {
    state: { userDetails },
  } = useUserContext()

  return userDetails ? (
    <List
      aria-labelledby='bidder-list-subheader'
      subheader={
        <StyledListSubheader id='bidder-list-subheader'>
          🛒 Bidder
        </StyledListSubheader>
      }
    >
      <Divider variant='middle' />
      {BIDDER_MENU_ITEMS.map((item) => {
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
  ) : null
}

export default BidderDrawerMenu
