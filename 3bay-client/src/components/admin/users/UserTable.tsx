import { useAdminUsersContext } from '../../../contexts/admin/UsersContext'
import MaterialTable, { Column } from '@material-table/core'
import { AdminUserDetail } from '../../../data/admin-user'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import moment from 'moment/moment'
import { Typography } from '@mui/material'
import '@fontsource/jetbrains-mono'

const UserTable = (): JSX.Element => {
  const { state: userState } = useAdminUsersContext()
  // uuid: string
  // name: string
  // email: string
  // isDisabled: boolean
  // role: string
  // dob: Date | null
  // verified: boolean
  // profile: string | null
  // address: string | null
  const lookup = { true: 'Yes', false: 'No' }
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
      editable: 'never',
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
    },
    {
      title: 'Verified',
      field: 'verified',
      lookup,
    },
    {
      title: 'Disabled',
      field: 'isDisabled',
      lookup,
    },
  ]

  return (
    <MaterialTable
      title={'Users'}
      columns={columns}
      data={userState.users}
      detailPanel={(rowData) => {
        console.log(JSON.stringify(rowData, null, 2))
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
      }}
      editable={{
        onRowAddCancelled: () => console.log('Row adding cancelled'),
        onRowUpdateCancelled: () => console.log('Row editing cancelled'),
        onRowUpdate: (newData) =>
          new Promise((resolve /*reject*/) => {
            setTimeout(() => {
              // const dataUpdate = [...data];
              // const index = oldData.tableData.id;
              // dataUpdate[index] = newData;
              // setData([...dataUpdate]);
              alert(JSON.stringify(newData, null, 2))

              resolve(newData)
            }, 1000)
          }),
      }}
    />
  )
}

export default UserTable
