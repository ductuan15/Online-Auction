import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import AppName from '../../../components/common/appname/AppName'
import { Alert, Avatar } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import KeyIcon from '@mui/icons-material/Key'
import '@fontsource/jetbrains-mono'
import AuthService from '../../../services/auth.service'
import { useLocation, useNavigate } from 'react-router-dom'
import EmailTextField from '../../../components/common/form/EmailTextField'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useIsMounted } from '../../../hooks'
import { useUserContext } from '../../../contexts/user/UserContext'
import GenericTextField from '../../../components/common/form/GenericTextField'
import { setErrorTextMsg } from '../../../utils/error'
import useTitle from '../../../hooks/use-title'

export type ChangeEmailForm = {
  email: string
  otp: string
}

const ChangeEmail = (): JSX.Element => {
  useTitle('3bay | Change my email address')
  const [error, setErrorText] = useState<string | null>(null)
  const [emailOK, setEmailOK] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resendButtonDisabled, setResendButtonDisabled] = useState(false)
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ChangeEmailForm>()

  const navigate = useNavigate()
  const location = useLocation()
  const isMounted = useIsMounted()
  const { dispatch } = useUserContext()

  const from = location.state?.from?.pathname || '/'

  async function startVerifyingEmail(data: ChangeEmailForm) {
    try {
      await AuthService.startChangingEmail(data.email)
      if (isMounted()) {
        setEmailOK(true)
        setErrorText(null)
      }
    } catch (e) {
      handleError(e)
    }
  }

  async function verifyNewEmail(data: ChangeEmailForm) {
    if (isMounted()) {
      setVerifying(true)
      setErrorText(null)
    }
    const responseData = await AuthService.verifyNewEmail(data)
    dispatch({
      type: 'GET_ACCOUNT_INFO',
      payload: responseData,
    })

    navigate(from, { replace: true })
  }

  function handleError(error: unknown) {
    setErrorTextMsg(error, setErrorText)
  }

  const onSubmit: SubmitHandler<ChangeEmailForm> = async (data) => {
    try {
      if (!emailOK) {
        await startVerifyingEmail(data)
      } else {
        await verifyNewEmail(data)
      }
    } catch (e) {
      handleError(e)
      if (isMounted()) {
        setVerifying(false)
      }
    }
  }

  const handleResendOtp = async () => {
    try {
      setErrorText(null)
      setResendButtonDisabled(true)
      await AuthService.resendChangeEmailOTP()

      setTimeout(() => {
        if (isMounted()) {
          setResendButtonDisabled(false)
        }
      }, 1000 * 60 * 3)
    } catch (e) {
      handleError(e)
    }
  }

  return (
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

      {!emailOK && (
        <Typography variant='body1' color='text.primary' textAlign='center'>
          Enter the email address associated with your account.
        </Typography>
      )}

      {error && (
        <Alert sx={{ mt: 2, mb: 2, width: 1 }} severity='error'>
          {error}
        </Alert>
      )}

      {resendButtonDisabled && (
        <Alert sx={{ mb: 2, width: 1 }} severity='info'>
          OTP has been sent! Please check your email
        </Alert>
      )}

      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <EmailTextField
          defaultValue={''}
          error={errors.email}
          control={control}
          name={'email'}
          id={'email'}
          label={'New email address'}
          textFieldProps={{
            margin: 'normal',
            disabled: emailOK,
          }}
        />

        {emailOK && (
          <GenericTextField
            error={errors.otp}
            label='OTP'
            id='otp'
            name='otp'
            control={control}
            defaultValue=''
            rules={{
              required: 'This field is required',
              validate: {
                emptyString: (value) => {
                  return (
                    (typeof value === 'string' && value.trim().length > 0) ||
                    'OTP should not be empty'
                  )
                },
              },
            }}
            textFieldProps={{
              autoFocus: true,
              margin: 'normal',
            }}
          />
        )}

        <Button
          disabled={verifying}
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 2, mb: 2 }}
        >
          Continue
        </Button>

        {emailOK && (
          <Button
            disabled={resendButtonDisabled || verifying}
            fullWidth
            variant='outlined'
            onClick={handleResendOtp}
            sx={{ mt: 1, mb: 2 }}
          >
            Resend
          </Button>
        )}
      </Box>
    </Box>
  )
}
export default ChangeEmail
