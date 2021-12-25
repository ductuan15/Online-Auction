import * as React from 'react'
import { useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import { SubmitHandler, useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import { AddUserFormInputs } from '../../../data/sign-up'
import Box from '@mui/material/Box'
import EmailTextField from '../../common/form/EmailTextField'
import DateInputField from '../../common/form/DateInputField'
import GenericTextField from '../../common/form/GenericTextField'
import PasswordInputField from '../../common/form/PasswordInputField'
import ConfirmPasswordInputField from '../../common/form/ConfirmPasswordInputField'
import LinearProgress from '@mui/material/LinearProgress'
import SelectField from '../../common/form/SelectField'
import Role from '../../../data/role'

type AddUserFormProps = {
  onSubmit: SubmitHandler<AddUserFormInputs>
}

const AddUserForm = ({ onSubmit }: AddUserFormProps): JSX.Element => {
  const { control, handleSubmit, watch, formState } =
    useForm<AddUserFormInputs>()
  const { errors } = formState

  const [disableAllElement, setDisableAllElement] = useState(false)

  const password = useRef<string | null>(null)
  password.current = watch('pwd', '')

  const onSubmitCb: SubmitHandler<AddUserFormInputs> = async (data, event) => {
    event?.preventDefault()

    setDisableAllElement(true)

    try {
      await onSubmit({ ...data }, event)
    } finally {
      setDisableAllElement(false)
    }
  }

  console.log(watch())

  return (
    <Box
      component='form'
      noValidate
      id={'add-user-form'}
      onSubmit={handleSubmit(onSubmitCb)}
      sx={{ mt: 3 }}
    >
      {disableAllElement && (
        <Box sx={{ m: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <Grid container spacing={2}>
        {/*name*/}
        <Grid item xs={12}>
          <GenericTextField
            error={errors.name}
            label='Name'
            id='name'
            name='name'
            control={control}
            defaultValue=''
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
            textFieldProps={{
              autoFocus: true,
              autoComplete: 'given-name',
              disabled: disableAllElement,
            }}
          />
        </Grid>

        {/*email*/}
        <Grid item sm={7} xs={12}>
          <EmailTextField
            defaultValue={''}
            error={errors.email}
            control={control}
            name={'email'}
            textFieldProps={{
              disabled: disableAllElement,
            }}
          />
        </Grid>

        <Grid item sm={5} xs={12}>
          <DateInputField
            label={'Date of birth'}
            error={errors.dob}
            control={control}
            name='dob'
            defaultValue={null}
            textFieldProps={{
              disabled: disableAllElement,
            }}
          />
        </Grid>

        {/*address*/}
        <Grid item xs={12}>
          <GenericTextField
            error={errors.address}
            label='Address'
            id='address'
            name='address'
            control={control}
            defaultValue=''
            textFieldProps={{
              disabled: disableAllElement,
            }}
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

        {/*pwd*/}
        <Grid item xs={12}>
          <PasswordInputField
            name='pwd'
            error={errors.pwd}
            defaultValue={''}
            control={control}
            textFieldProps={{
              disabled: disableAllElement,
            }}
          />
        </Grid>

        {/*re-enter pwd*/}
        <Grid item xs={12}>
          <ConfirmPasswordInputField
            name={'pwd2'}
            error={errors.pwd2}
            currentPassword={password.current}
            control={control}
            defaultValue=''
            textFieldProps={{
              disabled: disableAllElement,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <SelectField
            control={control}
            error={errors.role}
            label={'Role'}
            id={'role'}
            values={Object.values(Role)}
            defaultValue={'SELLER'}
            name={'role'}
            selectFieldProps={{
              disabled: disableAllElement,
            }}
          />
        </Grid>
      </Grid>

      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        disabled={disableAllElement}
      >
        Add
      </Button>
    </Box>
  )
}

export default AddUserForm
