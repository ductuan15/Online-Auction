import { Button, Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as React from 'react'
import PasswordInputField from '../../../components/common/form/PasswordInputField'

// type AccountProps = {
//   foo?: string
// }

type PasswordFormType = {
  pwd: string
  newPwd: string
}

const Password = (): JSX.Element => {
  // const { user } = useAuth()
  const { control, handleSubmit, watch, formState } =
    useForm<PasswordFormType>()

  const { errors } = formState

  const gridRowProps = {
    rowSpacing: 2,
    columnSpacing: 3,
    mt: 1,
    alignItems: 'center',
  }
  const labelGridProps = {
    xs: 3,
  }

  const inputGridProps = {
    xs: 9,
  }

  return (
    <Grid container>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography
          component='h2'
          color='text.primary'
          variant='h4'
          fontWeight='500'
        >
          Password Settings
        </Typography>

        <Button variant='contained'>Save changes</Button>
      </Grid>

      <Grid container {...gridRowProps} mt={2}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            Current password
          </Typography>
        </Grid>

        <Grid item {...inputGridProps}>
          <PasswordInputField
            name='pwd'
            error={errors.pwd}
            defaultValue={''}
            control={control}
          />
        </Grid>
      </Grid>

      <Grid container {...gridRowProps}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            New password
          </Typography>
        </Grid>

        <Grid item {...inputGridProps}>
          <PasswordInputField
            name='newPwd'
            error={errors.newPwd}
            defaultValue={''}
            control={control}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Password
