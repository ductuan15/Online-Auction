import TextField from '@mui/material/TextField'
import { Controller, FieldError } from 'react-hook-form'
import * as React from 'react'
import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import {TextFieldProps} from '@mui/material'

type EmailTextFieldProps<T extends { email: string }> =
  UseControllerProps<T> & {
    error: FieldError | undefined
    textFieldProps?: TextFieldProps
  }

const EmailTextField = <T extends { email: string }>({
  error,
  textFieldProps,
  ...control
}: EmailTextFieldProps<T>): JSX.Element => {
  return (
    <Controller
      rules={{
        required: 'This field is required',
        pattern: {
          value: /^\S+@\S+$/i,
          message: 'Use correct email format',
        },
      }}
      {...control}
      render={({ field }) => (
        <TextField
          error={!!error}
          fullWidth
          id='email'
          label='Email Address'
          autoComplete='email'
          inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
          helperText={error?.message}
          {...textFieldProps}
          {...field}
        />
      )}
    />
  )
}

export default EmailTextField
