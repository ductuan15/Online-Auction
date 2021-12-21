import { Button, Grid, Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import EmailTextField from '../../../components/common/form/EmailTextField'
import * as React from 'react'
import { useMemo, useState } from 'react'
import GenericTextField from '../../../components/common/form/GenericTextField'
import DateInputField from '../../../components/common/form/DateInputField'
import { UserDetails } from '../../../data/user'
import { useUserContext } from '../../../contexts/user/UserContext'
import UserService from '../../../services/user.service'
import axios, { AxiosError } from 'axios'
import { Alert } from '@mui/lab'
import { useAuth } from '../../../contexts/user/AuthContext'
import { useIsMounted } from 'usehooks-ts'
import { Link as RouterLink } from 'react-router-dom'

// type AccountProps = {
//   foo?: string
// }

const Account = (): JSX.Element => {
  const {
    state: { userDetails: user },
    dispatch,
  } = useUserContext()

  const authContext = useAuth()
  const isMounted = useIsMounted()

  const { control, reset, handleSubmit, formState } = useForm<UserDetails>({
    mode: 'onBlur',
  })

  const [errorText, setErrorText] = useState<string | null>('hvem er jeg')
  const [save, setSave] = useState(false)

  useMemo(() => {
    reset({
      uuid: user?.uuid || '',
      email: user?.email || '',
      name: user?.name || '',
      dob: user?.dob || null,
      address: user?.address || '',
    })
  }, [user])

  const { errors } = formState

  const gridRowProps = {
    rowSpacing: 2,
    columnSpacing: 3,
    mt: 1,
    alignItems: 'center',
  }
  const labelGridProps = {
    xs: 2,
    sm: 3,
  }

  const inputGridProps = {
    xs: 10,
    sm: 9,
  }

  const onSubmit: SubmitHandler<UserDetails> = async (data) => {
    try {
      await UserService.updateUserInfo(data, dispatch, authContext)
      setErrorText(null)
      setSave(true)
    } catch (e) {
      let msg = 'Unknown error occurred'
      if (axios.isAxiosError(e) && (e as AxiosError)) {
        msg = e.response?.data.message || 'Unknown error occurred'
      }
      if (isMounted()) {
        setErrorText(msg)
      }
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
          Account Settings
        </Typography>

        <Button variant='contained' type='submit'>
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
            Email
          </Typography>
        </Grid>

        <Grid item {...inputGridProps} xs={7} sm={6}>
          <EmailTextField
            error={errors.email}
            control={control}
            name={'email'}
            textFieldProps={{
              disabled: true,
            }}
          />
        </Grid>

        <Grid item container xs={3} sm={3} justifyContent='flex-end'>
          <Button variant='outlined' color='error' component={RouterLink} to={'/change-email'}>
            Change email
          </Button>
        </Grid>
      </Grid>

      <Grid container {...gridRowProps}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            Name
          </Typography>
        </Grid>

        <Grid item {...inputGridProps}>
          <GenericTextField
            error={errors.name}
            label='Name'
            id='name'
            name='name'
            control={control}
            rules={{
              required: 'This field is required',
              validate: {
                emptyString: (value) => {
                  return (
                    (typeof value === 'string' && value.trim().length > 0) ||
                    'Name should not be empty'
                  )
                },
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container {...gridRowProps}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            Date of birth
          </Typography>
        </Grid>

        <Grid item {...inputGridProps}>
          <DateInputField
            label={'Date of birth'}
            error={errors.dob}
            control={control}
            name='dob'
          />
        </Grid>
      </Grid>

      <Grid container {...gridRowProps}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            Address
          </Typography>
        </Grid>

        <Grid item {...inputGridProps}>
          <GenericTextField
            error={errors.address}
            label='Address'
            id='address'
            name='address'
            control={control}
            rules={{
              required: 'This field is required',
              validate: {
                emptyString: (value) => {
                  return (
                    (typeof value === 'string' && value.trim().length > 0) ||
                    'Address should not be empty'
                  )
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Account
