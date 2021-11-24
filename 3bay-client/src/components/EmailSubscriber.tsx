import { styled, Theme } from '@mui/material/styles'
import { Box, FormLabel } from '@mui/material'
import { SxProps } from '@mui/system'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'

const Form = styled('form')({})

export default function EmailSubscriber({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Form sx={sx}>
      <FormLabel
        htmlFor="email-subscribe"
        sx={{
          typography: 'caption',
          mb: 0.5,
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        Enter your email:
      </FormLabel>
      <Box
        sx={{
          display: 'flex',
          borderRadius: 1.5,
          overflow: 'hidden',
          width: { xs: '100%', sm: 'auto' },
          maxWidth: 360,
        }}
      >
        <InputBase
          id="email-subscribe"
          name="email"
          type="email"
          placeholder="example@email.com"
          inputProps={{ required: true }}
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.primary.dark
                : theme.palette.grey[200],
            px: 1,
            py: 0.5,
            typography: 'body2',
            flexGrow: 1,
            minWidth: 200,
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? theme.palette.primary.dark
                  : theme.palette.grey[300],
            },
          }}
        />
        <Button
          type="submit"
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.primary.dark
                : theme.palette.secondary.main,
            py: 1,
            px: 2,
            color: 'secondary.contrastText',
            borderRadius: '0px',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? theme.palette.primary.dark
                  : theme.palette.secondary.dark,
            },
          }}
        >
          Subscribe
        </Button>
      </Box>
    </Form>
  )
}
