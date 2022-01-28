import { useAuth } from '../../../contexts/user/AuthContext'
import { Chip, ChipProps, Typography } from '@mui/material'
import { useMemo } from 'react'

type RoleColor =
  | 'error'
  | 'primary'
  | 'success'
  | 'default'
  | 'secondary'
  | 'info'
  | 'warning'
  | undefined

const RoleLabel = (props?: ChipProps): JSX.Element => {
  const { user } = useAuth()
  const color: RoleColor = useMemo(() => {
    switch (user?.role) {
      case 'ADMINISTRATOR':
        return 'error'
      case 'BIDDER':
        return 'primary'
      case 'SELLER':
        return 'success'
    }
    return undefined
  }, [user?.role])

  return (
    <>
      {user && (
        <Chip
          {...props}
          color={color}
          label={
            <Typography fontWeight={550} variant='body1'>
              {user?.role}
            </Typography>
          }
        />
      )}
    </>
  )
}

export default RoleLabel
