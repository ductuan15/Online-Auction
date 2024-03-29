import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { SignUpFormInputs } from '../../../models/sign-up'
import Box from '@mui/material/Box'
import EmailTextField from '../../common/form/EmailTextField'
import DateInputField from '../../common/form/DateInputField'
import GenericTextField from '../../common/form/GenericTextField'
import PasswordInputField from '../../common/form/PasswordInputField'
import ConfirmPasswordInputField from '../../common/form/ConfirmPasswordInputField'
import ReCAPTCHA from 'react-google-recaptcha'
import config from '../../../config'
import LinearProgress from '@mui/material/LinearProgress'
import BorderButton from '../../common/button/BorderButton'

type SignUpFormProps = {
  onSubmit: SubmitHandler<SignUpFormInputs>
}

const SignUpForm = ({ onSubmit }: SignUpFormProps): JSX.Element => {
  const { control, handleSubmit, formState } = useForm<SignUpFormInputs>()
  const { errors } = formState

  const [disableSubmit, setDisableSubmit] = useState(true)
  const [disableAllElement, setDisableAllElement] = useState(false)

  useEffect(() => {
    if (!config.RECAPTCHA_SITE_KEY || config.RECAPTCHA_SITE_KEY.length === 0) {
      setDisableSubmit(false)
    }
  }, [])

  const password = useRef<string | null>(null)
  password.current = useWatch({ control, name: 'pwd', defaultValue: '' })
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const termAndConditionAccepted = useWatch({
    control,
    name: 'termAndConditionAccepted',
  })

  const onSubmitCb: SubmitHandler<SignUpFormInputs> = useCallback(
    async (data, event) => {
      event?.preventDefault()

      setDisableAllElement(true)

      let recaptchaValue = ''
      if (recaptchaRef.current !== null) {
        recaptchaValue = recaptchaRef.current.getValue() || ''
      }

      try {
        await onSubmit({ ...data, captchaToken: recaptchaValue }, event)
      } finally {
        setDisableAllElement(false)
      }
    },
    [onSubmit],
  )

  // console.log(watch())

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handleSubmit(onSubmitCb)}
      sx={{ mt: 3 }}
    >
      {disableAllElement && (
        <Box sx={{ m: 2 }}>
          <LinearProgress />
        </Box>
      )}

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
              disabled: disableAllElement,
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
            textFieldProps={{
              disabled: disableAllElement,
            }}
          />
        </Grid>

        <Grid item sm={5} xs={12}>
          <DateInputField
            label={'Date of birth'}
            error={errors.dob}
            control={control}
            name='dob'
            defaultValue={null}
            textFieldProps={{
              disabled: disableAllElement,
            }}
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
            textFieldProps={{
              disabled: disableAllElement,
            }}
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
            textFieldProps={{
              disabled: disableAllElement,
            }}
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
            textFieldProps={{
              disabled: disableAllElement,
            }}
          />
        </Grid>

        {/*email subscription*/}
        <Grid item xs={12}>
          <Controller
            name='termAndConditionAccepted'
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
                disabled={disableAllElement}
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>

      {config.RECAPTCHA_SITE_KEY.length !== 0 && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={config.RECAPTCHA_SITE_KEY}
          onChange={(token) => setDisableSubmit(!token)}
        />
      )}

      <BorderButton
        type='submit'
        fullWidth
        // variant='contained'
        sx={{ mt: 3, mb: 2 }}
        disabled={
          !termAndConditionAccepted || disableSubmit || disableAllElement
        }
      >
        Sign Up
      </BorderButton>
    </Box>
  )
}

export default SignUpForm
