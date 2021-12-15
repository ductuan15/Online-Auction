import Drawer from '@mui/material/Drawer'
import { useAppBarContext } from '../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

type AppDrawerProps = {
  anchor?: 'left' | 'top' | 'right' | 'bottom'
}

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
    >
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
        role='presentation'
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Typography>Hello world</Typography>
      </Box>
    </Drawer>
  )
}

export default AppDrawer
