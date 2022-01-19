import * as React from 'react'
import {useCallback, useState} from 'react'
import {Alert, Stack, Tab} from '@mui/material'
import Typography from '@mui/material/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import GroupIcon from '@mui/icons-material/Group'
import {useDebounce, useEffectOnce, useIsMounted} from '../../hooks'
import {setErrorTextMsg} from '../../utils/error'
import {useAdminUsersContext} from '../../contexts/admin/UsersContext'
import AdminService from '../../services/admin.service'
import {SubmitHandler} from 'react-hook-form'
import {AddUserFormInputs} from '../../models/sign-up'
import useTitle from '../../hooks/use-title'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import AddUserDialog from '../../components/admin/users/AddUserDialog'
import UserTable2 from '../../components/admin/users/UserTable2'
import UpgradeToSellerRequestTable2 from '../../components/admin/users/UpgradeToSellerRequestTable2'
import BorderButton from '../../components/common/button/BorderButton'
import RefreshIcon from '@mui/icons-material/Refresh'

const UsersManagement = (): JSX.Element => {
  useTitle('3bay | Manage users')
  const [isLoading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [dialogErrorText, setDialogErrorText] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState('1')
  const [shouldLoading, setShouldLoading] = useState(false)
  const shouldLoadingDebounce = useDebounce(shouldLoading, 500)
  const isMounted = useIsMounted()
  const {state: usersState, dispatch} = useAdminUsersContext()

  const onDialogSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    try {
      await AdminService.addUser(data)
      dispatch({type: 'NEW_USER_ADDED'})
      dispatch({type: 'CLOSE_ADD_USER_DIALOG'})
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
      setShouldLoading(false)
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
        setShouldLoading(false)
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
        dispatch({type: 'ADD_ALL_REQUEST_ADMIN_USERS', payload: userResponse})
        // onDataLoaded && onDataLoaded()
      } catch (e) {
        onTableError(e)
      }
    })()
  })

  const onTabChanged = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setTabValue(newValue)
    },
    [],
  )

  const onRefreshButtonClicked = useCallback(() => {
    setShouldLoading(true)
  }, [])

  return (
    <>
      <Stack direction='column' marginTop={1} marginBottom={1} spacing={1}>
        <Stack direction='row' alignItems='center' spacing={1}>
          <GroupIcon fontSize='large'/>

          <Typography
            color='text.primary'
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                typography: 'h5',
              },
              typography: 'h3',
            })}
          >
            Manage Users
          </Typography>

          <Box sx={{flexGrow: 1}}/>

          <BorderButton color='info' onClick={onRefreshButtonClicked}>
            <RefreshIcon color='inherit'/>
            Refresh
          </BorderButton>

          <BorderButton
            onClick={useCallback(() => {
              dispatch({type: 'OPEN_ADD_USER_DIALOG'})
            }, [dispatch])}
          >
            <AddRoundedIcon/>
            Register
          </BorderButton>
        </Stack>

        {errorText && (
          <Alert severity='error' sx={{my: 2}}>
            {errorText}
          </Alert>
        )}
        {/*{isLoading && <LinearProgress variant='indeterminate' />}*/}

        <Box sx={{width: '100%', typography: 'body1'}}>
          <TabContext value={tabValue}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <TabList
                onChange={onTabChanged}
                aria-label='users management tabs'
              >
                <Tab label='Manage users' value='1'/>
                <Tab label='Upgrade to seller requests' value='2'/>
              </TabList>
            </Box>
            <TabPanel value='1'>
              <UserTable2
                tab='1'
                onLoadingData={onLoadingData}
                onDataLoaded={onDataLoaded}
                onError={onTableError}
                isLoading={isLoading}
                shouldReload={shouldLoadingDebounce}
              />
            </TabPanel>
            <TabPanel value='2'>
              <UpgradeToSellerRequestTable2
                tab='2'
                onLoadingData={onLoadingData}
                onDataLoaded={onDataLoaded}
                onError={onTableError}
                isLoading={isLoading}
                shouldReload={shouldLoadingDebounce}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Stack>

      <AddUserDialog onSubmit={onDialogSubmit} errorText={dialogErrorText}/>
    </>
  )
}

export default UsersManagement
