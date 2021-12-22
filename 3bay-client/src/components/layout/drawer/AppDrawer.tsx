import Drawer from '@mui/material/Drawer'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import { APPBAR_LARGE, APPBAR_SMALL } from '../appbar/AppBar'
import { AppName } from '../AppName'
import CategoryList from './CategoryList'
import { useEffect } from 'react'
import axiosApiInstance from '../../../services/api'
import Category from '../../../data/category'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'

type AppDrawerProps = {
  anchor?: 'left' | 'top' | 'right' | 'bottom'
}

const DRAWER_WIDTH = 300

const AppDrawer = ({ anchor }: AppDrawerProps): JSX.Element => {
  const {
    state: { openDrawer },
    toggleDrawer,
  } = useAppBarContext()

  const { addAllCategories } = useCategoryContext()

  useEffect(() => {
    axiosApiInstance.get(`/api/category/`).then((response) => {
      const data = response.data as Array<Category>
      addAllCategories(data)
    })
  }, [])

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
        <CategoryList />
      </Box>
    </Drawer>
  )
}

export default AppDrawer
