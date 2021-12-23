import * as React from 'react'
import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { AppName } from '../../../components/layout/AppName'
import { SubmitHandler } from 'react-hook-form'
import { SignUpFormInputs } from '../../../data/sign-up'
import SignUpForm from '../../../components/user/auth/SignUpForm'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'
import AuthService from '../../../services/auth.service'
import { setErrorTextMsg } from '../../../utils/error'

const SignUp: () => JSX.Element = () => {
  const [errorText, setErrorText] = useState<string | null>(null)
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setErrorText(null)
    // console.log(data)

    try {
      const response = await AuthService.register(data)
      navigate(`/verify/${response.uuid}`, { replace: true })
    } catch (e) {
      setErrorTextMsg(e, setErrorText)
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

      {errorText && <Alert severity='error'>{errorText}</Alert>}

      <SignUpForm onSubmit={onSubmit} />

      <Grid container justifyContent='flex-end'>
        <Grid item>
          <Link component={RouterLink} variant='body2' to='/signin'>
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}
export default SignUp
