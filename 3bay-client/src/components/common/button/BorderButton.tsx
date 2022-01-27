import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GREY } from '../../../theme/palette'
import { useMemo } from 'react'

type BorderButtonProps = ButtonProps & {
  isSelected?: boolean
  padding?: number | string
  unSelectedColour?: string
  unSelectedBorderColour?: string
}

const BorderButton = styled(
  ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSelected,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    padding,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unSelectedColour,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unSelectedBorderColour,
    ...props
  }: BorderButtonProps) => (
    <Button variant='outlined' size='large' color='inherit' {...props} />
  ),
)(
  ({
    theme,
    color,
    isSelected,
    padding,
    unSelectedColour,
    unSelectedBorderColour,
  }) => {
    const colourMode = useMemo(() => {
      return color ?? 'primary'
    }, [color])

    const selectedColour = useMemo(() => {
      if (colourMode !== 'inherit') {
        return theme.palette[colourMode].main ?? theme.palette.primary.main
      } else {
        return colourMode
      }
    }, [colourMode, theme.palette])

    const borderColor = useMemo(() => {
      if (isSelected) {
        return selectedColour
      } else if (unSelectedBorderColour) {
        return unSelectedBorderColour
      } else {
        return theme.palette.mode === 'light'
          ? `${GREY[500_48]}`
          : `${GREY[500_24]}`
      }
    }, [isSelected, selectedColour, theme.palette.mode, unSelectedBorderColour])

    const letterSpacing = useMemo(
      () => +(theme.typography.button.letterSpacing || 0),
      [theme.typography.button.letterSpacing],
    )

    return {
      border: `1.75px solid ${borderColor}`,
      color: isSelected
        ? selectedColour
        : unSelectedColour ?? theme.palette.text.primary,
      borderRadius: 8,
      padding: padding
        ? padding
        : theme.spacing(1.5 - letterSpacing, 2, 1.25 - letterSpacing, 2),
      ['&:hover']: {
        border: `1.75px solid ${selectedColour}`,
        color: selectedColour,
      },
    }
  },
)

export default BorderButton
