import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import { Controller, FieldError, Path } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { SyntheticEvent, useCallback, useState } from 'react'
import { InputAdornment, TextFieldProps } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FieldPathValue, UnpackNestedValue } from 'react-hook-form/dist/types'

type PasswordInputFieldProps<T> = UseControllerProps<T> & {
  label?: string
  id?: string
  error?: FieldError | undefined
  defaultValue: UnpackNestedValue<FieldPathValue<T, Path<T>>>
  textFieldProps?: TextFieldProps
}

const PasswordInputField = <T extends { pwd: string }>({
  label,
  error,
  id,
  textFieldProps,
  ...controllerProps
}: PasswordInputFieldProps<T>): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = useCallback(() => {
    setShowPassword(!showPassword)
  }, [showPassword])

  const handleMouseDownPassword = useCallback((event: SyntheticEvent) => {
    event.preventDefault()
  }, [])

  return (
    <Controller
      rules={{
        required: 'This field is required',
        minLength: {
          value: 8,
          message: 'Password must have at least 8 characters',
        },
      }}
      {...controllerProps}
      render={({ field }) => (
        <TextField
          error={Boolean(error)}
          helperText={error?.message ?? ''}
          fullWidth
          label={label ?? 'Password'}
          id={id ?? 'password'}
          inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
          autoComplete='password'
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
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

export default PasswordInputField
