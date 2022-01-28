import { Grid, Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import EmailTextField from '../../../components/common/form/EmailTextField'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import GenericTextField from '../../../components/common/form/GenericTextField'
import DateInputField from '../../../components/common/form/DateInputField'
import { UserDetails } from '../../../models/user'
import { useUserContext } from '../../../contexts/user/UserContext'
import UserService from '../../../services/user.service'
import { Alert } from '@mui/lab'
import { useAuth } from '../../../contexts/user/AuthContext'
import { useIsMounted } from '../../../hooks'
import { Link as RouterLink } from 'react-router-dom'
import { setErrorTextMsg } from '../../../utils/error'
import useTitle from '../../../hooks/use-title'
import RoleLabel from '../../../components/user/profile/RoleLabel'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import BorderButton from '../../../components/common/button/BorderButton'
import { SxProps } from '@mui/system'

const gridRowProps: SxProps = {
  rowSpacing: 2,
  columnSpacing: 2,
  mt: 1,
  alignItems: 'center',
}
const labelGridProps: SxProps = {
  xs: 2,
  sm: 3,
}

const inputGridProps: SxProps = {
  xs: 10,
  sm: 9,
}

const Account = (): JSX.Element => {
  useTitle('3bay | Account settings')
  const {
    state: { userDetails: user },
    dispatch,
  } = useUserContext()

  const authContext = useAuth()
  const isMounted = useIsMounted()

  const { control, reset, handleSubmit, formState } = useForm<UserDetails>({
    defaultValues: useMemo((): UserDetails => {
      if (!user) {
        return {
          address: '',
          dob: null,
          uuid: '',
          name: '',
          email: '',
          role: '',
        }
      }
      return user
    }, [user]),
  })

  const [errorText, setErrorText] = useState<string | null>(null)
  const [save, setSave] = useState(false)

  useEffect(() => {
    reset(user)
  }, [reset, user])

  const { errors } = formState

  const onSubmit: SubmitHandler<UserDetails> = useCallback(
    async (data) => {
      try {
        await UserService.updateUserInfo(data, dispatch, authContext)
        setErrorText(null)
        setSave(true)
      } catch (e) {
        setErrorTextMsg(e, (msg) => {
          if (isMounted()) {
            setErrorText(msg)
          }
        })
      }
    },
    [authContext, dispatch, isMounted],
  )

  const requestToBidder = useCallback(async () => {
    try {
      setSave(false)
      setErrorText(null)
      const data = await UserService.upgradeToSeller()
      dispatch({ type: 'UPGRADE_TO_SELLER_REQUEST', payload: data })

      if (isMounted()) {
        setSave(true)
      }
    } catch (e) {
      if (isMounted()) {
        setErrorText('Cannot upgrade to seller')
      }
    }
  }, [dispatch, isMounted])

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

        <BorderButton
          size='large'
          type='submit'
          startIcon={<SaveOutlinedIcon />}
        >
          Save changes
        </BorderButton>
      </Grid>

      {user?.upgradeToSellerRequest && (
        <Grid container {...gridRowProps} justifyContent='flex-end'>
          <Grid item {...inputGridProps}>
            <Alert severity='info'>
              Request to become seller will be verified by 3bay Administrators!
            </Alert>
          </Grid>
        </Grid>
      )}

      {errorText && (
        <Grid container {...gridRowProps} mt={1} justifyContent='flex-end'>
          <Grid item {...inputGridProps}>
            <Alert severity='error'>{errorText}</Alert>
          </Grid>
        </Grid>
      )}

      {save && !errorText && (
        <Grid container {...gridRowProps} justifyContent='flex-end'>
          <Grid item {...inputGridProps}>
            <Alert severity='success'>Changes saved!</Alert>
          </Grid>
        </Grid>
      )}

      <Grid container {...gridRowProps} mt={2}>
        <Grid item {...labelGridProps}>
          <Typography align='right' color='text.secondary'>
            Role
          </Typography>
        </Grid>

        <Grid item {...inputGridProps} xs={5} sm={'auto'}>
          <RoleLabel sx={{ mb: 1 }} />
        </Grid>

        {user?.role === 'BIDDER' && (
          <Grid item container xs={5} sm={4} justifyContent='flex-end'>
            <BorderButton
              fullWidth
              disabled={!!user?.upgradeToSellerRequest}
              onClick={requestToBidder}
              startIcon={<StorefrontOutlinedIcon />}
            >
              Become a Seller
            </BorderButton>
          </Grid>
        )}
      </Grid>

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

        <Grid item container xs={6} sm={3} justifyContent='flex-end'>
          <RouterLink to={'/change-email'} style={{ textDecoration: 'none' }}>
            <BorderButton
              fullWidth
              variant='outlined'
              color='error'
              startIcon={<EmailOutlinedIcon />}
            >
              Change email
            </BorderButton>
          </RouterLink>
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
