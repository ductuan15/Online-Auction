import { Alert, Button, Grid, Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as React from 'react'
import { useState } from 'react'
import PasswordInputField from '../../../components/common/form/PasswordInputField'
import { useUserContext } from '../../../contexts/user/UserContext'
import UserService from '../../../services/user.service'
import { setErrorTextMsg } from '../../../utils/error'
import useTitle from '../../../hooks/use-title'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'

export type PasswordFormType = {
  pwd: string
  newPwd: string
}

const Password = (): JSX.Element => {
  useTitle('3bay | Password')
  const {
    state: { userDetails: user },
  } = useUserContext()

  const { control, formState, reset, handleSubmit } =
    useForm<PasswordFormType>()
  const [errorText, setErrorText] = useState<string | null>(null)
  const [save, setSave] = useState(false)

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

  const onSubmit: SubmitHandler<PasswordFormType> = async (data) => {
    try {
      if (user) {
        await UserService.changePassword(user, data)
        setErrorText(null)
        setSave(true)
        reset({
          pwd: '',
          newPwd: '',
        })
      }
    } catch (e) {
      setErrorTextMsg(e, setErrorText)
    }
  }

  return (
    <Grid
      container
      component='form'
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
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

        <Button
          variant='contained'
          type='submit'
          size='large'
          startIcon={<SaveOutlinedIcon />}
        >
          Save changes
        </Button>
      </Grid>

      {errorText && (
        <Grid container {...gridRowProps} mt={1} justifyContent='flex-end'>
          <Grid item {...inputGridProps}>
            <Alert severity='error'>{errorText}</Alert>
          </Grid>
        </Grid>
      )}

      {save && (
        <Grid container {...gridRowProps} justifyContent='flex-end'>
          <Grid item {...inputGridProps}>
            <Alert severity='success'>Changes saved!</Alert>
          </Grid>
        </Grid>
      )}

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
            id='newPwd'
            label='New password'
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
