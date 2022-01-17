import Drawer from '@mui/material/Drawer'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'
import Box from '@mui/material/Box'
import { APPBAR_LARGE, APPBAR_SMALL } from '../appbar/AppBar'
import AppName from '../appname/AppName'
import CategoryList from './CategoryList'
import { useEffect } from 'react'
import axiosApiInstance from '../../../services/api'
import Category from '../../../models/category'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import AdminDrawerMenu from '../../admin/home/AdminDrawerMenu'
import SellerDrawerMenu from '../../seller/home/SellerDrawerMenu'
import BidderDrawerMenu from './BidderDrawerMenu'

type AppDrawerProps = {
  anchor?: 'left' | 'top' | 'right' | 'bottom'
}

const DRAWER_WIDTH = 300

const AppDrawer = ({ anchor }: AppDrawerProps): JSX.Element => {
  const {
    state: { openDrawer },
    toggleDrawer,
  } = useLayoutContext()
  const { addAllCategories } = useCategoryContext()

  useEffect(() => {
    axiosApiInstance.get(`/api/category/`).then((response) => {
      const data = response.data as Array<Category>
      addAllCategories(data)
    })
  }, [addAllCategories])

  return (
    <Drawer
      anchor={anchor ?? 'left'}
      open={openDrawer}
      onClose={toggleDrawer(false)}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
      PaperProps={{
        sx: (theme) => ({
          background: theme.palette.background.paper,
        }),
      }}
    >
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        sx={(theme) => ({
          height: APPBAR_SMALL,
          [theme.breakpoints.up('sm')]: {
            height: APPBAR_LARGE,
          },
        })}
      >
        <AppName />
      </Box>

      <Box>
        <AdminDrawerMenu />
        <BidderDrawerMenu />
        <SellerDrawerMenu />
      </Box>

      <Box>
        <CategoryList />
      </Box>
    </Drawer>
  )
}

export default AppDrawer
