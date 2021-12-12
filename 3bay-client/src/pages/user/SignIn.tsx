import * as React from 'react'
import { FC } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AppName } from '../../components/layout/AppName'
import '@fontsource/jetbrains-mono'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Avatar, Divider, SvgIcon } from '@mui/material'
import { ReactComponent as GoogleIcon } from '../../assets/Google__G__Logo.svg'
import { ReactComponent as FBIcon } from '../../assets/Facebook_f_logo.svg'
import SignInLayout from '../../components/layout/SignInLayout'

const SignIn: FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    console.log({
      email: data.get('email'),
      pwd: data.get('password'),
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

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component='h1' variant='h6' color='text.primary'>
            Sign in
          </Typography>
        </Box>

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
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
          />
          <FormControlLabel sx={{display: 'none'}}
            control={<Checkbox value='remember' color='primary' />}
            label={
              <Typography variant='body1' color='text.primary'>
                Remember me
              </Typography>
            }
          />
          <Button
            type='link'
            fullWidth
            variant='contained'
            sx={{ mt: 2, mb: 2 }}
            href='https://youtu.be/dQw4w9WgXcQ'
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Divider sx={{ mt: 2, mb: 2 }}>
        <Typography color='text.primary'>or</Typography>
      </Divider>

      <Box
        sx={{
          mt: 1,
          mb: 2,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Button
          type='button'
          variant='outlined'
          color='secondary'
          sx={{ mx: 0.5, flexBasis: '100%' }}
          startIcon={<SvgIcon component={GoogleIcon} />}
        >
          Google
        </Button>

        <Button
          type='button'
          fullWidth
          variant='outlined'
          sx={{ mx: 0.5, flexBasis: '100%' }}
          startIcon={<SvgIcon component={FBIcon} />}
        >
          Facebook
        </Button>
      </Box>
    </SignInLayout>
  )
}
export default SignIn