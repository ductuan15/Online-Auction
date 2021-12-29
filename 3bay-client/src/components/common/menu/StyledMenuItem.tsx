import { NavLink, To, useMatch, useResolvedPath } from 'react-router-dom'
import { MenuItem, Typography } from '@mui/material'
import {SxProps} from '@mui/system'

type StyledMenuItemProps = {
  to: To
  selected?: boolean
  text: string
  sx?: SxProps
}

const StyledMenuItem = ({ to, text, sx }: StyledMenuItemProps): JSX.Element => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <MenuItem
      component={NavLink}
      sx={{
        py: 1,
        borderRadius: '8px',
        ...sx
      }}
      to={to}
      selected={!!match}
    >
      <Typography variant='button' color={match ? 'primary' : 'text.primary'}>
        {text}
      </Typography>
    </MenuItem>
  )
}

export default StyledMenuItem
