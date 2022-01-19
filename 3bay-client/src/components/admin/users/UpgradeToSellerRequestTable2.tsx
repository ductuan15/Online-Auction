import { useAdminUsersContext } from '../../../contexts/admin/UsersContext'
import { AdminUserDetail } from '../../../models/admin-user'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import '@fontsource/jetbrains-mono'
import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { useAuth } from '../../../contexts/user/AuthContext'
import CloseIcon from '@mui/icons-material/Close'
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from '@mui/x-data-grid'
import AdminService from '../../../services/admin.service'
import CheckIcon from '@mui/icons-material/Check'
import { useEffectOnce } from '../../../hooks'

type UpgradeToSellerRequestTableProps = {
  onLoadingData?: () => void
  onDataLoaded?: () => void
  onError?: (e: unknown) => void
  tab: string
  isLoading: boolean
  shouldReload: boolean
}

const UpgradeToSellerRequestTable = ({
  onLoadingData,
  onDataLoaded,
  onError,
  tab,
  isLoading,
  shouldReload,
}: UpgradeToSellerRequestTableProps): JSX.Element => {
  const { state: userState, dispatch } = useAdminUsersContext()
  // const [refresh, setRefresh] = useState(false)

  const { user: authData } = useAuth()

  const rows = useMemo(
    () =>
      userState.requestSellerUsers.map((user) => ({
        ...user,
        id: user.uuid,
      })),
    [userState.requestSellerUsers],
  )

  const loadData = useCallback(async () => {
    try {
      if (userState.currentTab !== tab) {
        dispatch({ type: 'SET_CURRENT_TAB', payload: tab })
        return
      }

      onLoadingData && onLoadingData()
      const userResponse = await AdminService.getRequestSellerUserList(
        userState.requestSellerTable.page,
        userState.requestSellerTable.limit,
      )
      dispatch({
        type: 'ADD_ALL_REQUEST_ADMIN_USERS',
        payload: userResponse,
      })

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
    userState.requestSellerTable.limit,
    userState.requestSellerTable.page,
  ])

  useEffectOnce(() => {
    ;(async () => await loadData())()
  })

  useEffect(() => {
    if (
      shouldReload ||
      userState.requestSellerTable.limit ||
      userState.requestSellerTable.page
    ) {
      ;(async () => await loadData())()
    }
  }, [
    loadData,
    shouldReload,
    userState.requestSellerTable.limit,
    userState.requestSellerTable.page,
  ])

  const onRowDelete = useCallback(
    async (params: GridRowParams<AdminUserDetail>, accept = true) => {
      try {
        onLoadingData && onLoadingData()
        let data: AdminUserDetail & {
          cancelUpgradeToSellerRequest?: boolean
        }
        if (accept && params.row.role === 'BIDDER') {
          data = {
            ...params.row,
            role: 'SELLER',
          }
        } else {
          data = {
            ...params.row,
            cancelUpgradeToSellerRequest: true,
          }
        }

        const userResponse = await AdminService.updateUser(data)
        dispatch({ type: 'UPDATE', payload: userResponse })

        // setRefresh(true)
        await loadData()

        onDataLoaded && onDataLoaded()
      } catch (e) {
        onError && onError(e)
      }
    },
    [dispatch, loadData, onDataLoaded, onError, onLoadingData],
  )

  const columns: GridColumns = useMemo(
    () => [
      {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key={params.id}
            icon={<CheckIcon />}
            label='Decline'
            disabled={!authData || params.row.uuid === authData.user}
            onClick={async () => {
              await onRowDelete(params as GridRowParams<AdminUserDetail>, true)
            }}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<CloseIcon />}
            label='Decline'
            disabled={!authData || params.row.uuid === authData.user}
            onClick={async () => {
              await onRowDelete(params as GridRowParams<AdminUserDetail>, false)
            }}
          />,
        ],
      },
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
        minWidth: 145,
      },
      {
        headerName: 'verified',
        field: 'verified',
        type: 'boolean',
      },
      {
        headerName: 'disabled',
        field: 'isDisabled',
        type: 'boolean',
      },
    ],
    [authData, onRowDelete],
  )

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      page={userState.requestSellerTable.page - 1}
      pageSize={userState.requestSellerTable.limit}
      rowCount={userState.requestSellerTable.total}
      loading={isLoading}
      paginationMode='server'
      rowsPerPageOptions={[5, 10, 25, 50]}
      onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page + 1 })}
      onPageSizeChange={(pageSize) =>
        dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize })
      }
      autoHeight
    />
  )
}

export default UpgradeToSellerRequestTable
