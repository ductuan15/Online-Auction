import * as React from 'react'
import { FC, SyntheticEvent, useRef, useState } from 'react'
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
import { InputAdornment } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import DateAdapter from '@mui/lab/AdapterMoment'
import { LocalizationProvider, MobileDatePicker } from '@mui/lab'
import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { SignUpFormInputs } from '../../store/admin/sign-up'

function renderDateOfBirthRow(
  control: Control<SignUpFormInputs>,
  errors: FieldErrors<SignUpFormInputs>,
) {
  return (
    <Grid item sm={6} xs={12}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Controller
          name='dob'
          control={control}
          rules={{
            required: 'This field is required',
          }}
          defaultValue={null}
          render={({ field }) => (
            <MobileDatePicker
              label='Date of birth'
              inputFormat='L'
              {...field}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  error={Boolean(errors.dob)}
                  helperText={errors.dob?.message}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : undefined,
                    )
                  }
                />
              )}
            />
          )}
        />
      </LocalizationProvider>
    </Grid>
  )
}

function renderNameRow(
  control: Control<SignUpFormInputs>,
  errors: FieldErrors<SignUpFormInputs>,
) {
  return (
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
  )
}

function renderEmailRow(
  control: Control<SignUpFormInputs>,
  errors: FieldErrors<SignUpFormInputs>,
) {
  return (
    <Grid item sm={6} xs={12}>
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
  )
}

function renderAddressRow(
  control: Control<SignUpFormInputs>,
  errors: FieldErrors<SignUpFormInputs>,
) {
  return (
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
        render={({ field }) => (
          <TextField
            error={Boolean(errors.address)}
            helperText={errors.address?.message}
            required
            fullWidth
            id='address'
            label='Address'
            inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
            {...field}
          />
        )}
      />
    </Grid>
  )
}

function renderPassword(
  control: Control<SignUpFormInputs>,
  showPassword: boolean,
  handleClickShowPassword: () => void,
  handleMouseDownPassword: (event: React.SyntheticEvent) => void,
  errors: FieldErrors<SignUpFormInputs>,
) {
  return (
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
  )
}

function renderPassword2(
  control: Control<SignUpFormInputs>,
  password: React.MutableRefObject<string | null>,
  showPassword2: boolean,
  handleClickShowPassword2: () => void,
  handleMouseDownPassword: (event: React.SyntheticEvent) => void,
  errors: FieldErrors<SignUpFormInputs>,
) {
  return (
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
            autoComplete='confirm-password'
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
  )
}

// TODO add recaptcha
const SignUp: FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>()

  console.log(watch())

  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const password = useRef<string | null>(null)
  password.current = watch('pwd', '')

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    console.log(data)
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

        <Box
          component='form'
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            {/*name*/}
            {renderNameRow(control, errors)}

            {/*email*/}
            {renderEmailRow(control, errors)}

            {renderDateOfBirthRow(control, errors)}

            {/*address*/}
            {renderAddressRow(control, errors)}

            {/*pwd*/}
            {renderPassword(
              control,
              showPassword,
              handleClickShowPassword,
              handleMouseDownPassword,
              errors,
            )}

            {/*re-enter pwd*/}
            {renderPassword2(
              control,
              password,
              showPassword2,
              handleClickShowPassword2,
              handleMouseDownPassword,
              errors,
            )}

            {/*email subscription*/}
            <Grid item xs={12}>
              <Controller
                name='emailSubscription'
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox value='allowExtraEmails' color='primary' />
                    }
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
