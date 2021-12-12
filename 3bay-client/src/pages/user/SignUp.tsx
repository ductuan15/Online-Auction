import * as React from 'react'
import { FC, SyntheticEvent, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import SignInLayout from '../../components/layout/SignInLayout'
import { AppName } from '../../components/layout/AppName'
import { InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import FormControl from '@mui/material/FormControl'
import DateAdapter from '@mui/lab/AdapterMoment'
import { LocalizationProvider, MobileDatePicker } from '@mui/lab'

// TODO add recaptcha
const SignUp: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [date, setDate] = React.useState<null | Date>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    console.log({
      email: data.get('email'),
      password: data.get('password'),
    })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  }

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  const handleDateChange = (newValue: Date | null) => {
    setDate(newValue)
    console.log(newValue)
  }

  return (
    <SignInLayout maxWidth='sm'>
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
            Sign up
          </Typography>
        </Box>

        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/*name*/}
            <Grid item xs={12}>
              <TextField
                autoComplete='given-name'
                name='name'
                required
                fullWidth
                id='name'
                label='Name'
                autoFocus
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
              />
            </Grid>

            {/*email*/}
            <Grid item sm={6} xs={12}>
              <TextField
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
              />
            </Grid>

            {/*dob*/}
            <Grid item sm={6} xs={12}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <MobileDatePicker
                  label='Date of birth'
                  inputFormat='L'
                  value={date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            {/*address*/}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='address'
                label='Address'
                name='address'
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
              />
            </Grid>

            {/*pwd*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='password'>Password</InputLabel>

                <OutlinedInput
                  name='password'
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  autoComplete='new-password'
                  inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
                  endAdornment={
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
                  }
                />
              </FormControl>
            </Grid>

            {/*re-enter pwd*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='password2'>Confirm password</InputLabel>

                <OutlinedInput
                  name='password2'
                  label='Confirm password'
                  type={showPassword2 ? 'text' : 'password'}
                  id='password2'
                  autoComplete='confirm-password'
                  inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password2 visibility'
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword}
                        edge='end'
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            {/*email subscription*/}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value='allowExtraEmails' color='primary' />}
                label={
                  <Typography variant='body1' color='text.primary'>
                    I agree to the terms and conditions
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='#' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SignInLayout>
  )
}
export default SignUp
