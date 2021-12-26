import { useAdminUsersContext } from '../../../contexts/admin/UsersContext'
import MaterialTable, {
  Action,
  Column,
  MaterialTableProps,
  Query,
  QueryResult,
} from '@material-table/core'
import { AdminUserDetail } from '../../../data/admin-user'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import moment from 'moment/moment'
import { Typography } from '@mui/material'
import '@fontsource/jetbrains-mono'
import AdminUserService from '../../../services/admin-users.service'
import { createRef, useCallback, useMemo } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useAuth } from '../../../contexts/user/AuthContext'

type UpgradeToSellerRequestTableProps = {
  onLoadingData?: () => void
  onDataLoaded?: () => void
  onError?: (e: unknown) => void
  tab: string
}

// const lookup = { true: 'Yes', false: 'No' }
const roleLookup = {
  BIDDER: 'BIDDER',
  SELLER: 'SELLER',
  ADMINISTRATOR: 'ADMIN',
}

const columns: Column<AdminUserDetail>[] = [
  {
    title: 'Profile',
    field: 'profile',
    render: (data) => {
      return <BackgroundLetterAvatars name={data.name} />
    },
    sorting: false,
    editable: 'never',
  },
  {
    title: 'Name',
    field: 'name',
    editable: 'never',
  },
  {
    title: 'Email',
    field: 'email',
    editable: 'never',
  },
  {
    title: 'DOB',
    field: 'dob',
    editable: 'onAdd',
    render: (data) => {
      return moment(data.dob).format('L')
    },
  },
  {
    title: 'Address',
    field: 'address',
    editable: 'never',
  },
  {
    title: 'Role',
    field: 'role',
    lookup: roleLookup,
    editable: 'never',
  },
  {
    title: 'Verified',
    field: 'verified',
    type: 'boolean',
    // lookup,
    editable: 'never',
  },
  {
    title: 'Disabled',
    field: 'isDisabled',
    type: 'boolean',
    editable: 'never',
    // lookup,
  },
]

const detailPanel = ({ rowData }: { rowData: AdminUserDetail }) => {
  return (
    <Typography
      variant='body1'
      fontFamily='Jetbrains Mono'
      mx={2}
      color='text.main'
      aria-multiline='true'
      sx={{
        whiteSpace: 'pre',
      }}
    >
      {JSON.stringify(rowData, null, 2)}
    </Typography>
  )
}

const UpgradeToSellerRequestTable = ({
  onLoadingData,
  onDataLoaded,
  onError,
  tab,
}: UpgradeToSellerRequestTableProps): JSX.Element => {
  const { state: userState, dispatch } = useAdminUsersContext()
  const tableRef = createRef<MaterialTableProps<AdminUserDetail>>()

  const { user: authData } = useAuth()

  const actions = useMemo<Action<AdminUserDetail>[]>(
    () => [
      {
        icon: () => <RefreshIcon />,
        tooltip: 'Refresh Data',
        isFreeAction: true,
        onClick: () =>
          tableRef.current &&
          tableRef.current.onQueryChange &&
          tableRef.current?.onQueryChange(),
      },
    ],
    [tableRef],
  )

  // const onRowDelete = useCallback(
  //   (oldData: AdminUserDetail) => {
  //     return new Promise((resolve, reject) => {
  //       ;(async () => {
  //         try {
  //           onLoadingData && onLoadingData()
  //
  //           const userResponse = await AdminUserService.updateUser({
  //             ...oldData,
  //             role: 'SELLER',
  //           })
  //           dispatch({type: 'UPDATE', payload: userResponse})
  //
  //           resolve({
  //             data: userState.requestToSellerUsers,
  //             page: userState.requestSellerTable.page - 1,
  //             totalCount: userState.requestSellerTable.total,
  //           })
  //           onDataLoaded && onDataLoaded()
  //         } catch (e) {
  //           onError && onError(e)
  //           reject(e)
  //         }
  //       })()
  //     })
  //   },
  //   [
  //     dispatch,
  //     onDataLoaded,
  //     onError,
  //     onLoadingData,
  //     userState.requestSellerTable.page,
  //     userState.requestSellerTable.total,
  //     userState.requestSellerUsers,
  //   ],
  // )

  const editable = useMemo<
    MaterialTableProps<AdminUserDetail>['editable']
  >(() => {
    return {
      isEditable: (rowData) => {
        return !!authData && rowData.uuid !== authData.user
      },
      isDeletable: (rowData) => {
        return !!authData && rowData.uuid !== authData.user
      },
      // onRowDelete: onRowDelete,
    }
  }, [authData])

  const fetchData = useCallback(
    (query: Query<AdminUserDetail>): Promise<QueryResult<AdminUserDetail>> => {
      return new Promise((resolve, reject) => {
        ;(async () => {
          try {
            if (userState.currentTab !== tab) {
              resolve({
                data: userState.requestSellerUsers,
                page: userState.requestSellerTable.page - 1,
                totalCount: userState.requestSellerTable.total,
              })
              dispatch({ type: 'SET_CURRENT_TAB', payload: tab })
              return
            }
            onLoadingData && onLoadingData()
            const userResponse =
              await AdminUserService.getRequestSellerUserList(
                query.page + 1,
                query.pageSize,
              )
            dispatch({
              type: 'ADD_ALL_REQUEST_ADMIN_USERS',
              payload: userResponse,
            })
            resolve({
              data: userResponse.users,
              page: userResponse.page - 1,
              totalCount: userResponse.total,
            })
            onDataLoaded && onDataLoaded()
          } catch (e) {
            onError && onError(e)
            reject(e)
          }
        })()
      })
    },
    [
      dispatch,
      onDataLoaded,
      onError,
      onLoadingData,
      tab,
      userState.currentTab,
      userState.requestSellerTable.page,
      userState.requestSellerTable.total,
      userState.requestSellerUsers,
    ],
  )

  return (
    <MaterialTable
      title={'Upgrade to SELLER request'}
      tableRef={tableRef}
      columns={columns}
      data={fetchData}
      detailPanel={detailPanel}
      actions={actions}
      editable={editable}
    />
  )
}

export default UpgradeToSellerRequestTable
