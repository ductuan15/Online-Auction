import Box from '@mui/material/Box'
import { AppName } from '../../../components/layout/AppName'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { Alert } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as React from 'react'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useAuth } from '../../../contexts/user/AuthContext'
import AuthService from '../../../services/auth.service'
import { setErrorTextMsg } from '../../../utils/error'

const VerifyAccount = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [resendButtonDisabled, setResendButtonDisabled] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'
  const urlParams = useParams()
  const { verify } = useAuth()

  const id = urlParams.id || ''
  useEffect(() => {
    ;(async () => {
      if (id === undefined) {
        navigate('/', { replace: true })
      }
      try {
        await AuthService.startVerifyingProcess(id)
      } catch (e) {
        console.log(e)
        navigate('/', { replace: true })
      } finally {
        setLoading(false)
      }
    })()
  }, [id, navigate])

  function handleError(error: unknown) {
    setErrorTextMsg(error, setErrorText)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setVerifying(true)
    const data = new FormData(event.currentTarget)

    const otp = (data.get('otp') as string) || ''

    try {
      await verify(id, otp, () => {
        navigate(from, { replace: true })
      })
    } catch (e) {
      handleError(e)
      setVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await AuthService.resendVerifyOTP(id)
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

      {!loading && (
        <>
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

            <Typography
              component='h1'
              variant='h6'
              color='text.primary'
              gutterBottom
            >
              Verify account
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant='body2' color='text.primary' gutterBottom>
              Check your email for the OTP code
            </Typography>

            {errorText && (
              <Alert sx={{ mt: 2, mb: 2 }} severity='error'>
                {errorText}
              </Alert>
            )}

            {!errorText && resendButtonDisabled && (
              <Alert sx={{ mt: 2, mb: 2 }} severity='info'>
                OTP has been sent! Please check your email
              </Alert>
            )}
          </Box>

          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='otp'
              label='OTP'
              name='otp'
              autoFocus
              inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
            />

            <Button
              type='submit'
              disabled={verifying}
              fullWidth
              variant='contained'
              sx={{ mt: 2, mb: 1 }}
            >
              Continue
            </Button>

            <Button
              disabled={resendButtonDisabled}
              fullWidth
              variant='outlined'
              onClick={handleResendOtp}
              sx={{ mt: 1, mb: 2 }}
            >
              Resend
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default VerifyAccount
