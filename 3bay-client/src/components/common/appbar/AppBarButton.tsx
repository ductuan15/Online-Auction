import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const AppBarButton = styled((props : ButtonProps) => (
  <Button
    variant='outlined'
    size='large'
    color='inherit'
    {...props}
  />
))(({ theme }) => {
  const letterSpacing = +(theme.typography.button.letterSpacing || 0)
  return {
    border:
      theme.palette.mode === 'light'
        ? `1.5px solid ${theme.palette.grey[300]}`
        : '1.5px solid white',
    borderRadius: 8,
    padding: theme.spacing(1.5 - letterSpacing, 2, 1.25 - letterSpacing, 1.5),
  }
})

export default AppBarButton
