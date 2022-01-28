import { styled, Theme } from '@mui/material/styles'
import { Box, FormLabel } from '@mui/material'
import { SxProps } from '@mui/system'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'

const Form = styled('form')({})

const emailTitle: SxProps = {
  typography: 'caption',
  mb: 0.5,
  color: 'text.secondary',
  fontWeight: 500,
}

const subscribeInputContainer: SxProps = {
  display: 'flex',
  borderRadius: 1.5,
  overflow: 'hidden',
  width: { xs: '100%', sm: 'auto' },
  maxWidth: 360,
}

const subscribeInput: SxProps<Theme> = {
  bgcolor: (theme) =>
    theme.palette.mode === 'dark'
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  px: 1,
  py: 0.5,
  typography: 'body2',
  flexGrow: 1,
  minWidth: 200,
  '&:hover': {
    bgcolor: (theme) =>
      theme.palette.mode === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[300],
  },
}

const subscribeButton: SxProps<Theme> = {
  bgcolor: 'secondary.main',
  py: 1,
  px: 2,
  color: 'secondary.contrastText',
  borderRadius: '0px',
  '&:hover': {
    bgcolor: (theme) => theme.palette.secondary.dark,
  },
}

export default function EmailSubscriber({
  sx,
}: {
  sx?: SxProps<Theme>
}): JSX.Element {
  return (
    <Form sx={sx}>
      <FormLabel htmlFor='email-subscribe' sx={emailTitle}>
        Enter your email:
      </FormLabel>

      <Box sx={subscribeInputContainer}>
        <InputBase
          id='email-subscribe'
          name='email'
          type='email'
          placeholder='example@email.com'
          inputProps={{ required: true }}
          sx={subscribeInput}
        />
        <Button type='submit' sx={subscribeButton}>
          Subscribe
        </Button>
      </Box>
    </Form>
  )
}
