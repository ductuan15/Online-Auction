import { Button, Grid, Typography } from '@mui/material'
import {SubmitHandler, useForm} from 'react-hook-form'
import EmailTextField from '../../../components/common/form/EmailTextField'
import * as React from 'react'
import {useMemo, useState} from 'react'
import GenericTextField from '../../../components/common/form/GenericTextField'
import DateInputField from '../../../components/common/form/DateInputField'
import { UserDetails } from '../../../data/user'
import { useUserContext } from '../../../contexts/user/UserContext'
import UserService from '../../../services/user.service'
import axios, {AxiosError} from 'axios'
import {Alert} from '@mui/lab'
import {useAuth} from '../../../contexts/user/AuthContext'

// type AccountProps = {
//   foo?: string
// }

const Account = (): JSX.Element => {
  const {
    state: { userDetails: user },
    dispatch,
  } = useUserContext()

  const authContext = useAuth()

  const { control, reset, handleSubmit, formState } =
    useForm<UserDetails>({ mode: 'onBlur' })

  const [error, setError] = useState<string | null>('hvem er jeg')
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
    xs: 3,
  }

  const inputGridProps = {
    xs: 9,
  }

  const onSubmit: SubmitHandler<UserDetails> = async (data) => {
    try {
      await UserService.updateUserInfo(data, dispatch, authContext)
      setError(null)
      setSave(true)
    } catch (e) {
      if (axios.isAxiosError(error) && (error as AxiosError)) {
        setError(error.response?.data.message || '')
      }
      else {
        setError('Unknown error occurred')
      }
    }
  }

  return (
    <Grid container component='form'
          noValidate
          onSubmit={handleSubmit(onSubmit)}>
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

        <Button variant='contained' type='submit'>Save changes</Button>
      </Grid>

      {error && (
        <Grid container {...gridRowProps} mt={1} justifyContent='flex-end'>
          <Grid item {...inputGridProps}>
            <Alert severity='error'>
              {error}
            </Alert>
          </Grid>
        </Grid>
      )}

      {save && (
        <Grid container {...gridRowProps} justifyContent='flex-end'>
          <Grid item {...inputGridProps}>
            <Alert severity='success'>
              Changes saved!
            </Alert>
          </Grid>
        </Grid>
      )}

      <Grid container {...gridRowProps} mt={2}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            Email
          </Typography>
        </Grid>

        <Grid item {...inputGridProps}>
          <EmailTextField
            error={errors.email}
            control={control}
            name={'email'}
            textFieldProps={{
              disabled: true,
            }}
          />
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
