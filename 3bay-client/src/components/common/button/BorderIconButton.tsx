import { ButtonProps, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GREY } from '../../../theme/palette'

const BorderIconButton = styled((props: ButtonProps) => (
  <IconButton size='large' {...props} />
))(({ theme }) => {
  const letterSpacing = +(theme.typography.button.letterSpacing || 0)
  return {
    border:
      theme.palette.mode === 'light'
        ? `1.75px solid ${GREY[500_48]}`
        : `1.75px solid ${GREY[500_24]}`,
    borderRadius: 8,
    padding: theme.spacing(1.5 - letterSpacing, 2, 1.25 - letterSpacing, 2),
  }
})

export default BorderIconButton
