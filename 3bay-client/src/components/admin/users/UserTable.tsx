import { Typography } from '@mui/material'
import 'mui-datatables'
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from 'mui-datatables'
import { useAdminUsersContext } from '../../../contexts/admin/UsersContext'

// type UserTableProps = {
//   columns?: MUIDataTableColumn[] | undefined
// } & Omit<MUIDataTableProps, 'columns'>

const COLUMN: MUIDataTableColumn[] = [
  {
    name: 'uuid',
    label: 'id',
    options: {
      draggable: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'name',
    label: 'Name',
    options: {
      filterType: 'custom',
      sortCompare: (order) => (val1, val2) => {
        return (
          (val1.data.length - val2.data.length) * (order === 'asc' ? 1 : -1)
        )
      },
    },
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'isDisabled',
    label: 'Is disabled',
  },
  {
    name: 'role',
    label: 'Role',
  },
  {
    name: 'dob',
    label: 'Date of birth',
  },
  {
    name: 'verified',
    label: 'Is verified',
  },
  {
    name: 'address',
    label: 'Address',
  },
]

const UserTable = (): JSX.Element => {
  const { state: userState } = useAdminUsersContext()

  const options: MUIDataTableOptions = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'vertical',
    serverSide: true,
    count: userState.total,
    rowsPerPage: userState.limit,
    rowsPerPageOptions: [],
    // sortOrder: sortOrder,
    onTableChange: (action, tableState) => {
      console.log(action, tableState)
    },
  }

  return (
    <MUIDataTable
      title={<Typography variant='h6'>User list</Typography>}
      data={userState.users}
      columns={COLUMN}
      options={options}
    />
  )
}

export default UserTable
