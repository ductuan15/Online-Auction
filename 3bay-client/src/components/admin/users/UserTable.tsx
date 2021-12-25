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
import { createRef } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useAuth } from '../../../contexts/user/AuthContext'

type UserTableProps = {
  onLoadingData?: () => void
  onDataLoaded?: () => void
  onError?: (e: unknown) => void
}

const UserTable = ({
  onLoadingData,
  onDataLoaded,
  onError,
}: UserTableProps): JSX.Element => {
  const { state: userState, dispatch } = useAdminUsersContext()
  const tableRef = createRef<MaterialTableProps<AdminUserDetail>>()

  const lookup = { true: 'Yes', false: 'No' }
  const roleLookup = {
    BIDDER: 'BIDDER',
    SELLER: 'SELLER',
    ADMINISTRATOR: 'ADMIN',
  }

  const { user: authData } = useAuth()

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
      editable: 'onAdd',
    },
    {
      title: 'Email',
      field: 'email',
      editable: 'onAdd',
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
      editable: 'onAdd',
    },
    {
      title: 'Role',
      field: 'role',
      lookup: roleLookup,
    },
    {
      title: 'Verified',
      field: 'verified',
      // type: 'boolean',
      lookup,
    },
    {
      title: 'Disabled',
      field: 'isDisabled',
      // type: 'boolean',
      lookup,
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

  const actions: Action<AdminUserDetail>[] = [
    {
      icon: () => <RefreshIcon />,
      tooltip: 'Refresh Data',
      isFreeAction: true,
      onClick: () =>
        tableRef.current &&
        tableRef.current.onQueryChange &&
        tableRef.current?.onQueryChange(),
    },
  ]

  const editable: MaterialTableProps<AdminUserDetail>['editable'] = {
    isEditable: (rowData) => {
      return !!authData && rowData.uuid !== authData.user
    },
    isDeletable: (rowData) => {
      return !!authData && rowData.uuid !== authData.user
    },
    onRowUpdate: (newData /*, oldData */) =>
      new Promise((resolve, reject) => {
        ;(async () => {
          try {
            onLoadingData && onLoadingData()
            const data = {
              ...newData,
              verified:
                typeof newData.verified === 'string'
                  ? newData.verified === 'true'
                  : newData.verified,
              isDisabled:
                typeof newData.isDisabled === 'string'
                  ? newData.isDisabled === 'true'
                  : newData.isDisabled,
            }
            const userResponse = await AdminUserService.updateUser(data)
            dispatch({ type: 'UPDATE', payload: userResponse })

            resolve({
              data: userState.users,
              page: userState.page - 1,
              totalCount: userState.total,
            })
            onDataLoaded && onDataLoaded()
          } catch (e) {
            onError && onError(e)
            reject(e)
          }
        })()
      }),
    onRowDelete: (oldData) =>
      new Promise((resolve, reject) => {
        ;(async () => {
          try {
            onLoadingData && onLoadingData()

            const userResponse = await AdminUserService.deleteUser(oldData)
            dispatch({ type: 'UPDATE', payload: userResponse })

            resolve({
              data: userState.users,
              page: userState.page - 1,
              totalCount: userState.total,
            })
            onDataLoaded && onDataLoaded()
          } catch (e) {
            onError && onError(e)
            reject(e)
          }
        })()
      }),
  }

  const fetchData = (
    query: Query<AdminUserDetail>,
  ): Promise<QueryResult<AdminUserDetail>> => {
    return new Promise((resolve, reject) => {
      ;(async () => {
        try {
          onLoadingData && onLoadingData()
          const userResponse = await AdminUserService.getUserList(
            query.page + 1,
            query.pageSize,
          )
          dispatch({ type: 'ADD_ALL', payload: userResponse })
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
  }

  return (
    <MaterialTable
      title={'Users'}
      tableRef={tableRef}
      columns={columns}
      data={fetchData}
      detailPanel={detailPanel}
      actions={actions}
      editable={editable}
    />
  )
}

export default UserTable
