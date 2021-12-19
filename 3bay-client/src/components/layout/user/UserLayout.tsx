import { Button, Grid, MenuItem, MenuList, Typography } from '@mui/material'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { useAuth } from '../../../contexts/user/AuthContext'
import { Link as RouterLink, Outlet, To } from 'react-router-dom'

// type UserLayoutProps = {
//   children?: ReactNode
// }

type StyledMenuItemProps = {
  to: To
  selected?: boolean
  text: string
}

const StyledMenuItem = ({
  to,
  selected,
  text,
}: StyledMenuItemProps): JSX.Element => {
  return (
    <MenuItem
      component={RouterLink}
      sx={{
        py: 1,
        borderRadius: '8px',
      }}
      to={to}
      selected={selected}
    >
      <Typography variant='button' color='text.primary'>
        {text}
      </Typography>
    </MenuItem>
  )
}

type MenuItemLink = {
  id: number
  text: string
  path: string
}

const MENU_ITEMS: MenuItemLink[] = [
  {
    id: 0,
    text: 'Account',
    path: '/user/account',
  },
  {
    id: 1,
    text: 'Password',
    path: '/user/password',
  },
]

const UserLayout = (): JSX.Element => {
  const { user } = useAuth()

  return (
    <Grid
      container
      marginTop={2}
      marginBottom={4}
      justifyContent='space-between'
      alignItems='flex-start'
    >
      <Grid item xs={12} md={8}>
        <Outlet />
      </Grid>

      <Grid
        item
        md={3.5}
        sx={{
          display: { xs: 'none', md: 'flex' },
          border: `2px solid rgba(145, 158, 171, 0.24)`,
          borderRadius: `8px`,
          padding: `24px`,
          flexDirection: 'column',
        }}
      >
        {/*Profile preview*/}
        <Grid
          container
          display='flex'
          flexDirection='row'
          spacing={1}
          alignItems='center'
          maxWidth='100%'
        >
          <Grid item>
            <BackgroundLetterAvatars
              name={user?.name || ''}
              sx={{
                width: `40px`,
                height: `40px`,
              }}
            />
          </Grid>

          <Grid
            item
            flexGrow='1'
            flexDirection='column'
            sx={{ maxWidth: '80%' }}
          >
            <Typography
              variant='h6'
              component='h2'
              px={1}
              color='text.primary'
              noWrap
            >
              {user?.name || ''}
            </Typography>

            <Button variant='text' component={RouterLink} to={'/user/view'}>
              <Typography variant='button'>View your profile</Typography>
            </Button>
          </Grid>
        </Grid>

        <Grid item component={MenuList} xs={12}>
          {MENU_ITEMS.map((item) => {
            return (
              <StyledMenuItem to={item.path} text={item.text} key={item.id} />
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserLayout
