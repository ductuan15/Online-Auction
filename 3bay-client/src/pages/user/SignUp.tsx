import * as React from 'react'
import { FC } from 'react'
import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import SignInLayout from '../../components/layout/SignInLayout'
import { AppName } from '../../components/layout/AppName'
import { SubmitHandler } from 'react-hook-form'
import { SignUpFormInputs } from '../../store/admin/sign-up'
import SignUpForm from '../../components/user/signup/SignUpForm'

// TODO add recaptcha
const SignUp: FC = () => {
  // console.log(watch())

  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    // data.dob = moment(data.dob ?? '').format()
    console.log(data)
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

        <SignUpForm onSubmit={onSubmit} />

        <Grid container justifyContent='flex-end'>
          <Grid item>
            <Link href='#' variant='body2'>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </SignInLayout>
  )
}
export default SignUp
