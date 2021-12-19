import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import { Controller, FieldError, Path } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { SyntheticEvent, useState } from 'react'
import {InputAdornment, TextFieldProps} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FieldPathValue, UnpackNestedValue } from 'react-hook-form/dist/types'

type ConfirmPasswordInputFieldProps<T> = UseControllerProps<T> & {
  label?: string
  id?: string
  error: FieldError | undefined
  defaultValue: UnpackNestedValue<FieldPathValue<T, Path<T>>>
  currentPassword: string,
  textFieldProps?: TextFieldProps
}

const ConfirmPasswordInputField = <T,>({
  label,
  error,
  id,
  currentPassword,
  textFieldProps,
  ...controllerProps
}: ConfirmPasswordInputFieldProps<T>): JSX.Element => {
  const [showPassword2, setShowPassword2] = useState(false)

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  }

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  return (
    <Controller
      rules={{
        required: 'This field is required',
        validate: (value) =>
          value === currentPassword || 'The passwords do not match',
      }}
      {...controllerProps}
      render={({ field }) => (
        <TextField
          error={Boolean(error)}
          helperText={error?.message}
          fullWidth
          label={label ?? 'Confirm password'}
          type={showPassword2 ? 'text' : 'password'}
          id={id ?? 'password2'}
          autoComplete='password'
          inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password2 visibility'
                  onClick={handleClickShowPassword2}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...textFieldProps}
          {...field}
        />
      )}
    />
  )
}

export default ConfirmPasswordInputField
