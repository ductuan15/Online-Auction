import { useAuth } from '../../../contexts/user/AuthContext'
import { Divider, List, ListSubheader } from '@mui/material'
import * as React from 'react'
import { ADMIN_MENU_ITEMS } from './AdminMenu'
import StyledMenuItem from '../../common/StyledMenuItem'

const AdminDrawerMenu = (): JSX.Element | null => {
  const { user } = useAuth()
  if (!user || user.role !== 'ADMINISTRATOR') {
    return null
  }

  return (
    <List
      aria-labelledby='admin-list-subheader'
      subheader={
        <ListSubheader component='div' id='admin-list-subheader'>
          🔑 Administration tasks
        </ListSubheader>
      }
    >
      <Divider variant='middle' />
      {ADMIN_MENU_ITEMS.map((item) => {
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

export default AdminDrawerMenu
