import * as React from 'react'
import { useEffect, useState } from 'react'
import { Alert, Grid, LinearProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import GroupIcon from '@mui/icons-material/Group'
import { useAdminUsersContext } from '../../contexts/admin/UsersContext'
import { setErrorTextMsg } from '../../utils/error'
import AdminUserService from '../../services/admin-users.service'
import { useIsMounted } from 'usehooks-ts'
import UserTable from '../../components/admin/users/UserTable'

const UsersManagement = (): JSX.Element => {
  const [isLoading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const { state: userState, dispatch } = useAdminUsersContext()
  const isMounted = useIsMounted()

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const userResponse = await AdminUserService.getUserList(
          userState.page,
          userState.limit,
        )

        dispatch({ type: 'ADD_ALL', payload: userResponse })
      } catch (e) {
        setErrorTextMsg(e, (msg) => {
          if (isMounted()) {
            setErrorText(msg)
          }
        })
      } finally {
        if (isMounted()) {
          setLoading(false)
        }
      }
    })()
  }, [])

  return (
    <>
      <Grid
        container
        marginTop={1}
        marginBottom={4}
        spacing={4}
        justifyContent='between'
      >
        <Grid display='flex' xs={12} item alignItems='center'>
          <Typography
            color='text.primary'
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                typography: 'h5',
              },
              typography: 'h3',
            })}
          >
            <GroupIcon fontSize='large' sx={{ mr: 2 }} />
            Manage Users
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Grid justifyContent='flex-end' alignItems='center'>
            <Button
              // onClick={openDialog}
              startIcon={<AddRoundedIcon />}
              variant='contained'
            >
              Register
            </Button>
          </Grid>
        </Grid>

        <Grid
          item
          container
          xs={12}
          justifyContent='center'
          flexDirection='column'
        >
          {errorText && (
            <Alert severity='error' sx={{ my: 2 }}>
              {errorText}
            </Alert>
          )}
          {isLoading && <LinearProgress variant='indeterminate' />}
          <UserTable />
        </Grid>
      </Grid>
      {/*  TODO add user dialog*/}
    </>
  )
}

export default UsersManagement
