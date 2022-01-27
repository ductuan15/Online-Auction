import { IconButton, IconButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GREY } from '../../../theme/palette'
import { useMemo } from 'react'

type BorderIconButtonProps = {
  isSelected?: boolean
} & IconButtonProps

const BorderIconButton = styled(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ isSelected, ...props }: BorderIconButtonProps) => (
    <IconButton size='large' {...props} />
  ),
)(({ theme, isSelected, color }) => {
  const letterSpacing = useMemo(
    () => +(theme.typography.button.letterSpacing || 0),
    [theme.typography.button.letterSpacing],
  )

  const selectedColor = useMemo(() => {
    const colorMode = color ?? 'primary'
    if (colorMode !== 'default' && colorMode !== 'inherit') {
      return theme.palette[colorMode].main ?? theme.palette.primary.main
    } else {
      return colorMode
    }
  }, [color, theme.palette])

  const borderColor = useMemo(() => {
    if (isSelected) {
      return selectedColor
    } else {
      return theme.palette.mode === 'light'
        ? `${GREY[500_48]}`
        : `${GREY[500_24]}`
    }
  }, [isSelected, selectedColor, theme.palette.mode])

  return {
    border: `1.75px solid ${borderColor}`,
    color: isSelected ? selectedColor : borderColor,
    borderRadius: 8,
    padding: theme.spacing(1.5 - letterSpacing, 2, 1.25 - letterSpacing, 2),
  }
})

export default BorderIconButton
