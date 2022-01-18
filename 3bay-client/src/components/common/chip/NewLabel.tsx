import {alpha} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {Chip} from '@mui/material'
import {SxProps} from '@mui/system'
import {GREY} from '../../../theme/palette'

const chipStyle: SxProps = {
  // boxShadow: 1,
  position: 'absolute',
  top: 0,
  right: 0,
  m: 1,
  borderColor: GREY[500_48],
  borderWidth: `1px`,
}

type NewLabelProps = {
  isSelected?: boolean
}

const NewLabel = ({ isSelected }: NewLabelProps): JSX.Element => {
  return <Chip
    sx={{
      ...chipStyle,
      bgcolor: isSelected ? 'warning.main' : alpha('#FFFFFF', 0.64),
    }}
    variant='outlined'
    label={
      <Typography fontWeight={550} variant='body1' color='black'>
        ✨ New
      </Typography>
    }
  />
}

export default NewLabel
