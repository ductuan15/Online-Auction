import * as React from 'react'
import { useState } from 'react'
import { Alert, Grid, LinearProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import GroupIcon from '@mui/icons-material/Group'
import { useIsMounted } from 'usehooks-ts'
import UserTable from '../../components/admin/users/UserTable'
import { setErrorTextMsg } from '../../utils/error'
import AddUserDialog from '../../components/admin/users/AddUserDialog'
import { useAdminUsersContext } from '../../contexts/admin/UsersContext'
import AdminUserService from '../../services/admin-users.service'
import { SubmitHandler } from 'react-hook-form'
import { AddUserFormInputs } from '../../data/sign-up'
import useTitle from '../../hooks/use-title'

const UsersManagement = (): JSX.Element => {
  useTitle('3bay | Manage users')
  const [isLoading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [dialogErrorText, setDialogErrorText] = useState<string | null>(null)
  const isMounted = useIsMounted()
  const { dispatch } = useAdminUsersContext()

  const onDialogSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    try {
      await AdminUserService.addUser(data)
      dispatch({ type: 'NEW_USER_ADDED' })
      dispatch({ type: 'CLOSE_ADD_USER_DIALOG' })
    } catch (e) {
      setErrorTextMsg(e, (msg) => {
        if (isMounted()) {
          setDialogErrorText(msg)
        }
      })
    }
  }

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
              onClick={() => {
                dispatch({ type: 'OPEN_ADD_USER_DIALOG' })
              }}
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
          <UserTable
            onLoadingData={() => {
              if (isMounted()) setLoading(true)
            }}
            onDataLoaded={() => {
              if (isMounted()) {
                setErrorText(null)
                setLoading(false)
              }
            }}
            onError={(e) => {
              if (isMounted()) {
                setErrorTextMsg(e, setErrorText)
                setLoading(false)
              }
            }}
          />
        </Grid>
      </Grid>

      <AddUserDialog onSubmit={onDialogSubmit} errorText={dialogErrorText} />
    </>
  )
}

export default UsersManagement
