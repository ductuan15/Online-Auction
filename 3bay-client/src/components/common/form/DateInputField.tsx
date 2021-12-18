import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import DateAdapter from '@mui/lab/AdapterMoment'
import { Controller, FieldError } from 'react-hook-form'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import TextField from '@mui/material/TextField'
import * as React from 'react'

type DateInputFieldProps<T> = {
  label: string
  error: FieldError | undefined
} & UseControllerProps<T>

const DateInputField = <T,>({
  label,
  error,
  ...controllerProps
}: DateInputFieldProps<T>): JSX.Element => {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Controller
        rules={{
          // default rule
          required: 'This field is required',
        }}
        {...controllerProps}
        render={({ field }) => (
          <DatePicker
            label={label}
            inputFormat='L'
            {...field}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        )}
      />
    </LocalizationProvider>
  )
}

export default DateInputField
