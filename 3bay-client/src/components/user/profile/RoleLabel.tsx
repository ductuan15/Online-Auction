import { useAuth } from '../../../contexts/user/AuthContext'
import { Chip, ChipProps, Typography } from '@mui/material'

const RoleLabel = (props?: ChipProps): JSX.Element => {
  const { user } = useAuth()
  let color:
    | 'error'
    | 'primary'
    | 'success'
    | 'default'
    | 'secondary'
    | 'info'
    | 'warning'
    | undefined

  switch (user?.role) {
    case 'ADMINISTRATOR':
      color = 'error'
      break
    case 'BIDDER':
      color = 'primary'
      break
    case 'SELLER':
      color = 'success'
      break
  }
  return (
    <>
      {user && (
        <Chip
          {...props}
          color={color}
          label={<Typography fontWeight={550} variant='body1'>{user?.role}</Typography>}
        />
      )}
    </>
  )
}

export default RoleLabel
