import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import { Controller, FieldError } from 'react-hook-form'
import * as React from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material'

type SelectFieldProps<T> = {
  error: FieldError | undefined
  label: string
  id: string
  values: string[]
  selectFieldProps?: SelectProps
} & UseControllerProps<T>

const SelectField = <T,>({
  error,
  label,
  id,
  values,
  selectFieldProps,
  ...controllerProps
}: SelectFieldProps<T>): JSX.Element => {
  return (
    <FormControl fullWidth>
      <InputLabel id={id}>{label}</InputLabel>
      <Controller
        {...controllerProps}
        render={({ field }) => (
          <Select
            fullWidth
            inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
            {...selectFieldProps}
            error={!!error}
            id={id}
            label={label}
            {...field}
          >
            {values.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  )
}

export default SelectField
