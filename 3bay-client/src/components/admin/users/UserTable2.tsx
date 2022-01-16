import { useAdminUsersContext } from '../../../contexts/admin/UsersContext'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import '@fontsource/jetbrains-mono'
import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { useAuth } from '../../../contexts/user/AuthContext'
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditCommitParams,
  GridColumns,
  GridRowParams,
} from '@mui/x-data-grid'
import CloseIcon from '@mui/icons-material/Close'
import AdminService from '../../../services/admin.service'
import { AdminUserDetail } from '../../../models/admin-user'
import { Alert, AlertProps, Snackbar } from '@mui/material'
import _ from 'lodash'

type UserTableProps = {
  onLoadingData?: () => void
  onDataLoaded?: () => void
  onError?: (e: unknown) => void
  tab?: string
  isLoading: boolean
}

const UserTable = ({
  onLoadingData,
  onDataLoaded,
  onError,
  tab,
  isLoading,
}: UserTableProps): JSX.Element => {
  const { state: userState, dispatch } = useAdminUsersContext()

  const { user: authData } = useAuth()

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  const handleCloseSnackbar = () => setSnackbar(null)

  const loadData = useCallback(async () => {
    try {
      if (tab && userState.currentTab !== tab) {
        dispatch({ type: 'SET_CURRENT_TAB', payload: tab })
        return
      }
      onLoadingData && onLoadingData()
      const userResponse = await AdminService.getUserList(
        userState.usersTable.page,
        userState.usersTable.limit,
      )
      dispatch({ type: 'ADD_ALL', payload: userResponse })
      onDataLoaded && onDataLoaded()
    } catch (e) {
      onError && onError(e)
    }
  }, [
    dispatch,
    onDataLoaded,
    onError,
    onLoadingData,
    tab,
    userState.currentTab,
    userState.usersTable.limit,
    userState.usersTable.page,
  ])

  const rows = useMemo(
    () =>
      userState.users.map((user) => ({
        ...user,
        id: user.uuid,
      })),
    [userState.users],
  )

  const handleCellEditCommit = useCallback(
    async (params: GridCellEditCommitParams) => {
      try {
        const idx = _.findIndex(userState.users, (row) => {
          return row.uuid === params.id
        })
        if (idx === -1) {
          return
        }

        const data = {
          ...userState.users[idx],
          [params['field']]: params.value,
        }

        const userResponse = await AdminService.updateUser(data)
        dispatch({ type: 'UPDATE', payload: userResponse })

        setSnackbar({
          children: 'User successfully saved',
          severity: 'success',
        })
      } catch (e) {
        setSnackbar({ children: 'Error while saving user', severity: 'error' })
        onError && onError(e)
        // Restore the row in case of error
        // setRows((prev) => [...prev])
      }
    },
    [dispatch, onError, userState.users],
  )

  const onRowDelete = useCallback(
    async (params: GridRowParams<AdminUserDetail>) => {
      // console.log(params.row)
      if (confirm(`Do you really want to remove ${params.row.name}`)) {
        try {
          onLoadingData && onLoadingData()

          await AdminService.deleteUser(params.row)
          await loadData()

          onDataLoaded && onDataLoaded()
        } catch (e) {
          onError && onError(e)
        }
      }
    },
    [loadData, onDataLoaded, onError, onLoadingData],
  )

  useEffect(() => {
    ;(async () => await loadData())()
  }, [loadData])

  const columns: GridColumns = useMemo(
    () => [
      {
        // minWidth: 300,
        field: 'id',
        type: 'string',
        headerName: 'ID',
        valueGetter: (params) => {
          return params.row.uuid
        },
      },
      {
        field: 'name',
        type: 'string',
        flex: 1,
        headerName: 'Name',
        minWidth: 250,
      },
      {
        field: 'thumbnail',
        headerName: 'Avatar',
        type: 'string',
        valueGetter: (params) => {
          if (params.row.name) {
            return params.row.name
          }
          return 'Tuan Cuong'
        },
        renderCell: (params) => {
          return <BackgroundLetterAvatars name={params.value} sx={{ mx: 2 }} />
        },
      },
      {
        headerName: 'Email',
        field: 'email',
        type: 'string',
        minWidth: 250,
      },
      {
        headerName: 'DOB',
        field: 'dob',
        type: 'date',
        valueGetter: ({ row }) => row.dob && new Date(row.dob),
      },
      {
        field: 'address',
        type: 'string',
        headerName: 'address',
        minWidth: 200,
      },
      {
        headerName: 'Role',
        field: 'role',
        type: 'singleSelect',
        valueOptions: ['BIDDER', 'SELLER', 'ADMINISTRATOR'],
        editable: true,
        minWidth: 145,
      },
      {
        headerName: 'verified',
        field: 'verified',
        type: 'boolean',
        editable: true,
      },
      {
        headerName: 'disabled',
        field: 'isDisabled',
        type: 'boolean',
        editable: true,
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key={params.id}
            icon={<CloseIcon />}
            label='Remove'
            disabled={!authData || params.row.uuid === authData.user}
            onClick={async () => {
              await onRowDelete(params as GridRowParams<AdminUserDetail>)
            }}
          />,
        ],
      },
    ],
    [authData, onRowDelete],
  )

  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        page={userState.usersTable.page - 1}
        pageSize={userState.usersTable.limit}
        rowCount={userState.usersTable.total}
        loading={isLoading}
        paginationMode='server'
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={(page) =>
          dispatch({ type: 'SET_PAGE', payload: page + 1 })
        }
        onPageSizeChange={(pageSize) =>
          dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize })
        }
        isCellEditable={(params) => !!(authData && params.row.uuid !== authData.user)}
        onCellEditCommit={handleCellEditCommit}
        autoHeight
      />
      {!!snackbar && (
        <Snackbar
          open
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </>
  )
}

export default UserTable
