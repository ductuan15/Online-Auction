import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GREY } from '../../../theme/palette'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BorderButton = styled(
  ({ isSelected, ...props }: ButtonProps & { isSelected?: boolean }) => (
    <Button variant='outlined' size='large' color='inherit' {...props} />
  ),
)(({ theme, color, isSelected }) => {
  const colorMode = color ?? 'primary'
  let selectedColor
  if (colorMode !== 'inherit') {
    selectedColor = theme.palette[colorMode].main ?? theme.palette.primary.main
  } else {
    selectedColor = colorMode
  }

  let borderColor
  if (isSelected) {
    borderColor = selectedColor
  } else {
    borderColor =
      theme.palette.mode === 'light' ? `${GREY[500_48]}` : `${GREY[500_24]}`
  }

  const letterSpacing = +(theme.typography.button.letterSpacing || 0)
  return {
    border: `1.75px solid ${borderColor}`,
    color: isSelected ? selectedColor : undefined,
    borderRadius: 8,
    padding: theme.spacing(1.5 - letterSpacing, 2, 1.25 - letterSpacing, 2),
    ['&:hover']: {
      border: `1.75px solid ${selectedColor}`,
      color: selectedColor,
    },
  }
})

export default BorderButton
