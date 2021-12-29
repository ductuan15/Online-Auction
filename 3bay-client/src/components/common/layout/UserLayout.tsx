import { Button, Grid, MenuList, Typography } from '@mui/material'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import { useUserContext } from '../../../contexts/user/UserContext'
import StyledMenuItem from '../menu/StyledMenuItem'

// type UserLayoutProps = {
//   children?: ReactNode
// }

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
  const {
    state: { userDetails: user },
  } = useUserContext()

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
              fontStyle='bold'
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
