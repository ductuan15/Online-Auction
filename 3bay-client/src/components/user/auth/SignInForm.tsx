import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import * as React from 'react'
import { SyntheticEvent, useCallback, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { InputAdornment } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import BorderButton from '../../common/button/BorderButton'

type SignInFormProps = {
  handleSubmit: SubmitHandler<{ email: string; pwd: string }>
  isLoading?: boolean
}

const SignInForm = ({
  handleSubmit,
  isLoading,
}: SignInFormProps): JSX.Element => {
  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      // event.currentTarget.reset()

      // console.log({
      //   email: data.get('email'),
      //   pwd: data.get('password'),
      // })

      handleSubmit({
        email: (data.get('email') as string) || '',
        pwd: (data.get('password') as string) || '',
      })
    },
    [handleSubmit],
  )

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = useCallback(() => {
    setShowPassword((prevState) => !prevState)
  }, [])

  const handleMouseDownPassword = useCallback((event: SyntheticEvent) => {
    event.preventDefault()
  }, [])

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
        InputProps={{ disabled: isLoading }}
      />
      <TextField
        margin='normal'
        required
        fullWidth
        name='password'
        label='Password'
        id='password'
        autoComplete='current-password'
        inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          disabled: isLoading,
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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

      <BorderButton
        type='submit'
        fullWidth
        // variant='contained'
        sx={{ mt: 2, mb: 2 }}
        disabled={isLoading}
      >
        Sign In
      </BorderButton>

      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} variant='body2' to='/forgot'>
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
