import * as React from 'react'
import { ColorModeContext } from '../../../theme'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import { useTheme } from '@mui/material'
import { SxProps } from '@mui/system'

export const ThemeChangeButton = ({ sx }: { sx: SxProps }): JSX.Element => {
  const colorMode = React.useContext(ColorModeContext)
  const theme = useTheme()

  return (
    <Box sx={sx}>
      <IconButton
        size='large'
        color='inherit'
        onClick={colorMode.toggleColorMode}
      >
        <Tooltip title='Change theme'>
          {theme.palette.mode === 'light' ? (
            <Brightness2OutlinedIcon />
          ) : (
            <Brightness4OutlinedIcon />
          )}
        </Tooltip>
      </IconButton>
    </Box>
  )
}
