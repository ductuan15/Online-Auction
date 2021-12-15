import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import * as React from 'react'
import { SubmitHandler } from 'react-hook-form'

type SignInFormProps = {
  handleSubmit: SubmitHandler<{ email: string; pwd: string }>
}

const SignInForm = ({ handleSubmit }: SignInFormProps): JSX.Element => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    event.currentTarget.reset()
    // console.log({
    //   email: data.get('email'),
    //   pwd: data.get('password'),
    // })

    handleSubmit({
      email: (data.get('email') as string) || '',
      pwd: (data.get('password') as string) || '',
    })
  }
  return (
    <Box component='form' onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
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
      <FormControlLabel
        sx={{ display: 'none' }}
        control={<Checkbox value='remember' color='primary' />}
        label={
          <Typography variant='body1' color='text.primary'>
            Remember me
          </Typography>
        }
      />
      <Button type='submit' fullWidth variant='contained' sx={{ mt: 2, mb: 2 }}>
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          {/*TODO forgot password*/}
          <Link component={RouterLink} variant='body2' to='/'>
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} variant='body2' to='/signup'>
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SignInForm
