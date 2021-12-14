import { Controller } from 'react-hook-form'
import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import * as React from 'react'
import { FC } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export interface FormTextFieldProps {
  error: boolean
  errorMsg: string | undefined
  controllerProps: UseControllerProps
  textFieldProps: TextFieldProps
}

const FormTextField: FC<FormTextFieldProps> = ({
  error,
  errorMsg,
  controllerProps,
  textFieldProps,
}) => {
  return (
    <Controller
      {...controllerProps}
      render={({ field }) => (
        <TextField
          {...textFieldProps}
          {...field}
          error={error}
          helperText={errorMsg ?? ''}
        />
      )}
    />
  )
}

export default FormTextField

