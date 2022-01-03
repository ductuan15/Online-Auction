import * as React from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppName from '../../../components/common/appname/AppName'
import '@fontsource/jetbrains-mono'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, Avatar, Divider, SvgIcon } from '@mui/material'
import { ReactComponent as GoogleIcon } from '../../../assets/Google__G__Logo.svg'
import { ReactComponent as FBIcon } from '../../../assets/Facebook_f_logo.svg'
import SignInForm from '../../../components/user/auth/SignInForm'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/user/AuthContext'
import axios, { AxiosError } from 'axios'
import useTitle from '../../../hooks/use-title'

const SignIn: () => JSX.Element = () => {
  useTitle('3bay | Sign in')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { signIn } = useAuth()
  const [errorText, setErrorText] = useState<string | null>(null)

  const handleSubmit = async (data: { email: string; pwd: string }) => {
    const { email, pwd } = data
    setErrorText(null)
    //console.log(data)
    try {
      await signIn(email, pwd, () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
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
                console.log(parseError)
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
    }
  }

  return (
    <>
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
            Sign in
          </Typography>
        </Box>

        {errorText && <Alert severity='error'>{errorText}</Alert>}

        <SignInForm handleSubmit={handleSubmit} />
      </Box>

      <Divider sx={{ mt: 2, mb: 2 }}>
        <Typography color='text.primary'>or</Typography>
      </Divider>

      <Box
        sx={{
          mt: 1,
          mb: 2,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Button
          type='button'
          variant='outlined'
          color='secondary'
          sx={{ mx: 0.5, flexBasis: '100%' }}
          startIcon={<SvgIcon component={GoogleIcon} />}
        >
          Google
        </Button>

        <Button
          type='button'
          fullWidth
          variant='outlined'
          sx={{ mx: 0.5, flexBasis: '100%' }}
          startIcon={<SvgIcon component={FBIcon} />}
        >
          Facebook
        </Button>
      </Box>
    </>
  )
}
export default SignIn
