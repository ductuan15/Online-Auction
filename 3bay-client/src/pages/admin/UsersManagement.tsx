import * as React from 'react'
import { useCallback, useState } from 'react'
import { Alert, Grid, LinearProgress, Tab } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import GroupIcon from '@mui/icons-material/Group'
import { useEffectOnce, useIsMounted } from 'usehooks-ts'
import UserTable from '../../components/admin/users/UserTable'
import { setErrorTextMsg } from '../../utils/error'
import { useAdminUsersContext } from '../../contexts/admin/UsersContext'
import AdminService from '../../services/admin.service'
import { SubmitHandler } from 'react-hook-form'
import { AddUserFormInputs } from '../../models/sign-up'
import useTitle from '../../hooks/use-title'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import AddUserDialog from '../../components/admin/users/AddUserDialog'
import UpgradeToSellerRequestTable from '../../components/admin/users/UpgradeToSellerRequestTable'

const UsersManagement = (): JSX.Element => {
  useTitle('3bay | Manage users')
  const [isLoading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [dialogErrorText, setDialogErrorText] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState('1')
  const isMounted = useIsMounted()
  const { state: usersState, dispatch } = useAdminUsersContext()

  const onDialogSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    try {
      await AdminService.addUser(data)
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
  const onLoadingData = useCallback(() => {
    if (isMounted()) {
      setLoading(true)
    }
  }, [isMounted])

  const onDataLoaded = useCallback(() => {
    if (isMounted()) {
      setErrorText(null)
      setLoading(false)
    }
  }, [isMounted])

  const onTableError = useCallback(
    (e: unknown) => {
      if (isMounted()) {
        setErrorTextMsg(e, setErrorText)
        setLoading(false)
      }
    },
    [isMounted],
  )

  useEffectOnce(() => {
    ;(async () => {
      try {
        // onLoadingData()
        const userResponse = await AdminService.getRequestSellerUserList(
          usersState.requestSellerTable.page,
          usersState.requestSellerTable.limit,
        )
        dispatch({ type: 'ADD_ALL_REQUEST_ADMIN_USERS', payload: userResponse })
        // onDataLoaded && onDataLoaded()
      } catch (e) {
        onTableError(e)
      }
    })()
  })

  const onTabChanged = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  return (
    <>
      <Grid
        container
        marginTop={1}
        marginBottom={1}
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

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={onTabChanged}
                  aria-label='users management tabs'
                >
                  <Tab label='Manage users' value='1' />
                  <Tab label='Upgrade to seller requests' value='2' />
                </TabList>
              </Box>
              <TabPanel value='1'>
                <UserTable
                  tab='1'
                  onLoadingData={onLoadingData}
                  onDataLoaded={onDataLoaded}
                  onError={onTableError}
                />
              </TabPanel>
              <TabPanel value='2'>
                <UpgradeToSellerRequestTable
                  tab='2'
                  onLoadingData={onLoadingData}
                  onDataLoaded={onDataLoaded}
                  onError={onTableError}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
      </Grid>

      <AddUserDialog onSubmit={onDialogSubmit} errorText={dialogErrorText} />
    </>
  )
}

export default UsersManagement
