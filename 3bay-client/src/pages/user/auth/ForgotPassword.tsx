import * as React from 'react'
import { SyntheticEvent, useState } from 'react'
import Box from '@mui/material/Box'
import AppName from '../../../components/common/appname/AppName'
import { Alert, Avatar, InputAdornment } from '@mui/material'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import KeyIcon from '@mui/icons-material/Key'
import '@fontsource/jetbrains-mono'
import IconButton from '@mui/material/IconButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import AuthService from '../../../services/auth.service'
import { useAuth } from '../../../contexts/user/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { setErrorTextMsg } from '../../../utils/error'
import useTitle from '../../../hooks/use-title'

const ForgotPassword = (): JSX.Element => {
  useTitle('3bay | Forgot password')
  const [errorText, setErrorText] = useState<string | null>(null)
  const [emailOK, setEmailOK] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resendButtonDisabled, setResendButtonDisabled] = useState(false)
  const [email, setEmail] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'
  const { resetPassword } = useAuth()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  }

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  async function verifyEmail(event: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget)
    setEmail(data.get('email') as string)

    await AuthService.checkEmailBeforeResetPassword(data.get('email') as string)
    setEmailOK(true)
    setErrorText(null)
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget)
    const pwd = data.get('pwd') as string
    const pwd2 = data.get('pwd2') as string
    if (pwd !== pwd2) {
      setErrorText('Password mismatched')
      return
    }

    const otp = data.get('otp') as string
    setVerifying(true)
    await resetPassword(email, pwd, otp, () => {
      navigate(from, { replace: true })
    })

    setErrorText(null)
  }

  function handleError(error: unknown) {
    setErrorTextMsg(error, setErrorText)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (!emailOK) {
        await verifyEmail(event)
      } else {
        await changePassword(event)
      }
    } catch (e) {
      handleError(e)
      setVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await AuthService.resendResetPasswordOTP(email)
      setErrorText(null)
      setResendButtonDisabled(true)
      setTimeout(() => {
        setResendButtonDisabled(false)
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

      {errorText && (
        <Alert sx={{ mt: 2, mb: 2, width: 1 }} severity='error'>
          {errorText}
        </Alert>
      )}

      {resendButtonDisabled && (
        <Alert sx={{ mb: 2, width: 1 }} severity='info'>
          OTP has been sent! Please check your email
        </Alert>
      )}

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
          disabled={emailOK}
          inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
        />

        {emailOK && (
          <>
            <TextField
              margin='normal'
              required={emailOK}
              name='pwd'
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
            />
            <TextField
              margin='normal'
              required={emailOK}
              name='pwd2'
              defaultValue=''
              fullWidth
              label='Confirm password'
              type={showPassword2 ? 'text' : 'password'}
              id='password2'
              autoComplete='password'
              InputProps={{
                style: { fontFamily: 'Jetbrains Mono' },
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
            />

            <TextField
              margin='normal'
              required={emailOK}
              fullWidth
              id='otp'
              label='OTP'
              name='otp'
              autoFocus
              inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
            />
          </>
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
export default ForgotPassword
