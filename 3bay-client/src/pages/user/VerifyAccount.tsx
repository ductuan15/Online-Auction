import Box from '@mui/material/Box'
import { AppName } from '../../components/layout/AppName'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { Alert, CircularProgress, Fade } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as React from 'react'
import { useEffect, useState } from 'react'
import axiosApiInstance from '../../services/api'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios, { AxiosError } from 'axios'
import { useAuth } from '../../contexts/user/AuthContext'

const VerifyAccount = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  // const [wrongCodeError, setWrongCodeError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'
  const urlParams = useParams()
  const { verify } = useAuth()

  const id = urlParams.id
  useEffect(() => {
    if (id === undefined) {
      navigate('/', { replace: true })
    }

    axiosApiInstance
      .get(`/auth/verify/${id}`)
      .then(() => {
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        navigate('/', { replace: true })
      })
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setVerifying(true)
    const data = new FormData(event.currentTarget)

    const otp = (data.get('otp') as string) || ''

    try {
      await verify(urlParams.id || '', otp, () => {
        navigate(from, { replace: true })
      })
    } catch (e) {
      if (axios.isAxiosError(error) && (error as AxiosError)) {
        setError(error.response?.data.message || '')
      } else {
        setError('Unknown error')
      }
      setVerifying(false)
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

      <Box sx={{ height: 40 }}>
        <Fade
          in={loading}
          style={{
            transitionDelay: loading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
      </Box>

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

            <Typography component='h1' variant='h6' color='text.primary'>
              Verify account
            </Typography>
            {/*TODO Add OTP description*/}
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
              sx={{ mt: 2, mb: 2 }}
            >
              Continue
            </Button>
          </Box>
        </>
      )}

      {error && <Alert severity='error'>{error}</Alert>}
    </Box>
  )
}

export default VerifyAccount
