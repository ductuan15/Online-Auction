import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import { Controller, FieldError } from 'react-hook-form'
import * as React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

type GenericTextFieldProps<T> = {
  error: FieldError | undefined
  label: string
  id: string
  textFieldProps?: TextFieldProps
} & UseControllerProps<T>

const GenericTextField = <T,>({
  error,
  label,
  id,
  textFieldProps,
  ...controllerProps
}: GenericTextFieldProps<T>): JSX.Element => {
  return (
    <Controller
      {...controllerProps}
      render={({ field }) => (
        <TextField
          fullWidth
          inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
          helperText={error?.message}
          {...textFieldProps}
          error={!!error}
          id={id}
          label={label}
          {...field}
        />
      )}
    />
  )
}

export default GenericTextField
