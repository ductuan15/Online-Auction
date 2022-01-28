import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppName from '../../../components/common/appname/AppName'
import '@fontsource/jetbrains-mono'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, Avatar } from '@mui/material'
import SignInForm from '../../../components/user/auth/SignInForm'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/user/AuthContext'
import axios, { AxiosError } from 'axios'
import useTitle from '../../../hooks/use-title'
import { SxProps } from '@mui/system'

const containerStyle: SxProps = {
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const SignIn: () => JSX.Element = () => {
  useTitle('3bay | Sign in')
  const navigate = useNavigate()
  const location = useLocation()
  const from = useMemo(
    () => location.state?.from?.pathname || '/',
    [location.state?.from?.pathname],
  )

  const { signIn, user } = useAuth()
  const [errorText, setErrorText] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user])

  const handleSubmit = useCallback(
    async (data: { email: string; pwd: string }) => {
      const { email, pwd } = data
      setErrorText(null)
      //console.log(data)
      try {
        setLoading(true)
        await signIn(email, pwd, () => {
          navigate(from, { replace: true })
        })
      } catch (e) {
        if (axios.isAxiosError(e) && (e as AxiosError)) {
          switch (e.response?.data.name) {
            case 'AuthEmailNotConfirmed':
              {
                try {
                  const uuid = e.response?.data.metaData.uuid || ''
                  navigate(`/verify/${uuid}`, { replace: true })
                  return
                } catch (parseError) {
                  // console.log(parseError)
                }
              }
              break
            case 'AuthAccountDisabled': {
              setErrorText(e.response?.data.message)
              return
            }
          }
        }
        setErrorText('Wrong email or password')
      } finally {
        setLoading(false)
      }
    },
    [from, navigate, signIn],
  )

  return (
    <>
      <Box sx={containerStyle}>
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
            Sign in
          </Typography>
        </Box>
        {/*{isLoading && <LinearProgress sx={{ width: 1 }} />}*/}

        {errorText && <Alert severity='error'>{errorText}</Alert>}

        <SignInForm handleSubmit={handleSubmit} isLoading={isLoading} />
      </Box>

      {/*<Divider sx={{ mt: 2, mb: 2 }}>*/}
      {/*  <Typography color='text.primary'>or</Typography>*/}
      {/*</Divider>*/}

      {/*<Box*/}
      {/*  sx={{*/}
      {/*    mt: 1,*/}
      {/*    mb: 2,*/}
      {/*    display: 'flex',*/}
      {/*    flexDirection: 'row',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Button*/}
      {/*    type='button'*/}
      {/*    variant='outlined'*/}
      {/*    color='secondary'*/}
      {/*    sx={{ mx: 0.5, flexBasis: '100%' }}*/}
      {/*    startIcon={<SvgIcon component={GoogleIcon} />}*/}
      {/*  >*/}
      {/*    Google*/}
      {/*  </Button>*/}

      {/*  <Button*/}
      {/*    type='button'*/}
      {/*    fullWidth*/}
      {/*    variant='outlined'*/}
      {/*    sx={{ mx: 0.5, flexBasis: '100%' }}*/}
      {/*    startIcon={<SvgIcon component={FBIcon} />}*/}
      {/*  >*/}
      {/*    Facebook*/}
      {/*  </Button>*/}
      {/*</Box>*/}
    </>
  )
}
export default SignIn
