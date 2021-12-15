import * as React from 'react'
import { SyntheticEvent, useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { SignUpFormInputs } from '../../../data/sign-up'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterMoment'
import { InputAdornment } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'

type SignUpFormProps = {
  onSubmit: SubmitHandler<SignUpFormInputs>
}

const SignUpForm = ({ onSubmit }: SignUpFormProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>()

  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const password = useRef<string | null>(null)
  password.current = watch('pwd', '')

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  }

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 3 }}
    >
      <Grid container spacing={2}>
        {/*name*/}
        <Grid item xs={12}>
          <Controller
            name='name'
            control={control}
            defaultValue=''
            rules={{
              required: 'This field is required',
              validate: {
                emptyString: (value: string) =>
                  value.trim().length > 0 || 'Name should not be empty',
              },
            }}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.name)}
                autoComplete='given-name'
                fullWidth
                id='name'
                label='Name'
                autoFocus
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
                helperText={errors.name?.message}
                {...field}
              />
            )}
          />
        </Grid>

        {/*email*/}
        <Grid item sm={7} xs={12}>
          <Controller
            name='email'
            defaultValue=''
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Use correct email format',
              },
            }}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.email)}
                fullWidth
                id='email'
                label='Email Address'
                autoComplete='email'
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
                helperText={errors.email?.message}
                {...field}
              />
            )}
          />
        </Grid>

        <Grid item sm={5} xs={12}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <Controller
              name='dob'
              control={control}
              rules={{
                required: 'This field is required',
              }}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  label='Date of birth'
                  inputFormat='L'
                  {...field}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      error={Boolean(errors.dob)}
                      helperText={errors.dob?.message}
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {/*address*/}
        <Grid item xs={12}>
          <Controller
            name='address'
            control={control}
            rules={{
              required: 'This field is required',
              validate: {
                emptyString: (value: string) =>
                  value.trim().length > 0 || 'Address should not be empty',
              },
            }}
            defaultValue={''}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                fullWidth
                id='address'
                label='Address'
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
                {...field}
              />
            )}
          />
        </Grid>

        {/*pwd*/}
        <Grid item xs={12}>
          <Controller
            name='pwd'
            control={control}
            defaultValue=''
            rules={{
              required: 'This field is required',
              minLength: {
                value: 8,
                message: 'Password must have at least 8 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.pwd)}
                helperText={errors.pwd?.message}
                fullWidth
                label='Password'
                id='password'
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
                autoComplete='new-password'
                type={showPassword ? 'text' : 'password'}
                InputProps={{
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
                {...field}
              />
            )}
          />
        </Grid>

        {/*re-enter pwd*/}
        <Grid item xs={12}>
          <Controller
            name='pwd2'
            control={control}
            defaultValue=''
            rules={{
              required: 'This field is required',
              validate: (value) =>
                value === password.current || 'The passwords do not match',
            }}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.pwd2)}
                helperText={errors.pwd2?.message}
                fullWidth
                label='Confirm password'
                type={showPassword2 ? 'text' : 'password'}
                id='password2'
                autoComplete='password'
                inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
                InputProps={{
                  endAdornment: (
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
                  ),
                }}
                {...field}
              />
            )}
          />
        </Grid>

        {/*email subscription*/}
        <Grid item xs={12}>
          <Controller
            name='emailSubscription'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox value='allowExtraEmails' color='primary' />}
                label={
                  <Typography variant='body1' color='text.primary'>
                    I agree to the terms and conditions
                  </Typography>
                }
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>

      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        disabled={!watch('emailSubscription')}
      >
        Sign Up
      </Button>
    </Box>
  )
}

export default SignUpForm
