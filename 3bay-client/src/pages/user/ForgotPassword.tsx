import * as React from 'react'
import Box from '@mui/material/Box'
import { AppName } from '../../components/layout/AppName'
import { Avatar } from '@mui/material'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SignInLayout from '../../components/layout/SignInLayout'
import KeyIcon from '@mui/icons-material/Key'
import '@fontsource/jetbrains-mono'

const ForgotPassword = (): JSX.Element => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    console.log({
      email: data.get('email'),
    })
  }

  return (
    <SignInLayout>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AppName bigSize />

        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <KeyIcon />
        </Avatar>

        <Typography component='h1' variant='h6' color='text.primary'>
          Forgot password?
        </Typography>

        <Typography variant='body1' color='text.primary'>
          Enter the email address associated with your account.
        </Typography>

        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
          />
          <Button fullWidth variant='contained' sx={{ mt: 2, mb: 2 }}>
            Continue
          </Button>
        </Box>
      </Box>
    </SignInLayout>
  )
}
export default ForgotPassword
