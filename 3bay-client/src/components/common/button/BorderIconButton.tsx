import { IconButton, IconButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GREY } from '../../../theme/palette'

type BorderIconButtonProps = {
  isSelected?: boolean
} & IconButtonProps

const BorderIconButton = styled(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ isSelected, ...props }: BorderIconButtonProps) => (
    <IconButton size='large' {...props} />
  ),
)(({ theme, isSelected, color }) => {
  const letterSpacing = +(theme.typography.button.letterSpacing || 0)
  let borderColor: string

  const colorMode = color ?? 'primary'
  let selectedColor
  if (colorMode !== 'default' && colorMode !== 'inherit') {
    selectedColor = theme.palette[colorMode].main ?? theme.palette.primary.main
  } else {
    selectedColor = colorMode
  }

  if (isSelected) {
    borderColor = selectedColor
  } else {
    borderColor =
      theme.palette.mode === 'light' ? `${GREY[500_48]}` : `${GREY[500_24]}`
  }

  return {
    border: `1.75px solid ${borderColor}`,
    color: isSelected ? selectedColor : borderColor,
    borderRadius: 8,
    padding: theme.spacing(1.5 - letterSpacing, 2, 1.25 - letterSpacing, 2),
  }
})

export default BorderIconButton
