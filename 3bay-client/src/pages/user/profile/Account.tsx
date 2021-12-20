import { Button, Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import EmailTextField from '../../../components/common/form/EmailTextField'
import * as React from 'react'
import GenericTextField from '../../../components/common/form/GenericTextField'
import DateInputField from '../../../components/common/form/DateInputField'
import { UserDetails } from '../../../data/user'
import { useUserContext } from '../../../contexts/user/UserContext'

// type AccountProps = {
//   foo?: string
// }

const Account = (): JSX.Element => {
  const {
    state: { userDetails: user },
  } = useUserContext()

  const { control, handleSubmit, watch, formState } = useForm<UserDetails>()

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
          Account Settings
        </Typography>

        <Button variant='contained'>Save changes</Button>
      </Grid>

      <Grid container {...gridRowProps} mt={2}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            Email
          </Typography>
        </Grid>

        <Grid item {...inputGridProps}>
          <EmailTextField
            defaultValue={user?.email || ''}
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
            defaultValue={user?.name || ''}
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
            defaultValue={user?.dob || null}
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
            defaultValue={user?.address || ''}
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
