import * as React from 'react'
import { useRef } from 'react'
import Grid from '@mui/material/Grid'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { SignUpFormInputs } from '../../../data/sign-up'
import Box from '@mui/material/Box'
import EmailTextField from '../../common/form/EmailTextField'
import DateInputField from '../../common/form/DateInputField'
import GenericTextField from '../../common/form/TextField'
import PasswordInputField from '../../common/form/PasswordInputField'
import ConfirmPasswordInputField from '../../common/form/ConfirmPasswordInputField'

type SignUpFormProps = {
  onSubmit: SubmitHandler<SignUpFormInputs>
}

const SignUpForm = ({ onSubmit }: SignUpFormProps): JSX.Element => {
  const { control, handleSubmit, watch, formState } =
    useForm<SignUpFormInputs>()
  const { errors } = formState

  const password = useRef<string | null>(null)
  password.current = watch('pwd', '')

  console.log(watch())

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
          <GenericTextField
            error={errors.name}
            label='Name'
            id='name'
            name='name'
            control={control}
            defaultValue=''
            rules={{
              required: 'This field is required',
              validate: {
                emptyString: (value) => {
                  return (
                    (typeof value === 'string' && value.trim().length > 0) ||
                    'Name should not be empty'
                  )
                },
              },
            }}
            textFieldProps={{
              autoFocus: true,
              autoComplete: 'given-name',
            }}
          />
        </Grid>

        {/*email*/}
        <Grid item sm={7} xs={12}>
          <EmailTextField
            defaultValue={''}
            error={errors.email}
            control={control}
            name={'email'}
          />
        </Grid>

        <Grid item sm={5} xs={12}>
          <DateInputField
            label={'Date of birth'}
            error={errors.dob}
            control={control}
            name='dob'
            defaultValue={null}
          />
        </Grid>

        {/*address*/}
        <Grid item xs={12}>
          <GenericTextField
            error={errors.address}
            label='Address'
            id='address'
            name='address'
            control={control}
            defaultValue=''
            rules={{
              required: 'This field is required',
              validate: {
                emptyString: (value) => {
                  return (
                    (typeof value === 'string' && value.trim().length > 0) ||
                    'Address should not be empty'
                  )
                },
              },
            }}
          />
        </Grid>

        {/*pwd*/}
        <Grid item xs={12}>
          <PasswordInputField
            name='pwd'
            error={errors.pwd}
            defaultValue={''}
            control={control}
          />
        </Grid>

        {/*re-enter pwd*/}
        <Grid item xs={12}>
          <ConfirmPasswordInputField
            name={'pwd2'}
            error={errors.pwd2}
            currentPassword={password.current}
            control={control}
            defaultValue=''
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
