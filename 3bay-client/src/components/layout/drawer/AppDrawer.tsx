import Drawer from '@mui/material/Drawer'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import { APPBAR_LARGE, APPBAR_SMALL } from '../appbar/AppBar'
import { AppName } from '../AppName'
import { CategoryProvider } from '../../../contexts/admin/CategoryContext'
import CategoryList from './CategoryList'

type AppDrawerProps = {
  anchor?: 'left' | 'top' | 'right' | 'bottom'
}

const DRAWER_WIDTH = 256

const AppDrawer = ({ anchor }: AppDrawerProps): JSX.Element => {
  const {
    state: { openDrawer },
    toggleDrawer,
  } = useAppBarContext()

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
        <CategoryProvider>
          <CategoryList />
        </CategoryProvider>
      </Box>
    </Drawer>
  )
}

export default AppDrawer
