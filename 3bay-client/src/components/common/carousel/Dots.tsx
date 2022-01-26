import { styled, Theme } from '@mui/material/styles'
import { DotProps } from 'react-multi-carousel'
import { GREY } from '../../../theme/palette'

import './Dots.css'

const StyledButton = styled('button')({})

const Dots = ({
  // index,
  active,
  onClick,
  // carouselState,
  nItems,
  theme,
}: DotProps & { theme: Theme; nItems: number }) => {
  const totalItems = nItems > 0 ? nItems : 1
  const widthPercent = 100 / totalItems
  return (
    <StyledButton
      onClick={(e) => {
        onClick?.()
        e.preventDefault()
      }}
      sx={{
        width: `${widthPercent}%`,
        // marginLeft: index === 0 ? 0 : '4px',
        // marginRight: index === totalItems - 1 ? 0 : '4px',
        backgroundColor: active
          ? `${theme.palette.text.primary}`
          : `${GREY[500_48]}`,
        border: 'none',
        outline: 'none',
        // borderRadius: index === 0 || index === totalItems - 1 ? '8px' : undefined,
        height: '4px',
        '&:hover': {
          backgroundColor: active
            ? `${theme.palette.text.primary}`
            : `${GREY[500_80]}`,
          // transform: 'scale(1, 2)',
        },
      }}
    />
  )
}

export default Dots