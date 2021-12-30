import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import DateAdapter from '@mui/lab/AdapterMoment'
import { Controller, FieldError } from 'react-hook-form'
import {DateTimePicker, DateTimePickerProps, LocalizationProvider} from '@mui/lab'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import { TextFieldProps } from '@mui/material'

type DateTimeInputFieldProps<T> = {
  label?: string
  error: FieldError | undefined
  textFieldProps?: TextFieldProps
  dateTimePickerProps?: Partial<DateTimePickerProps>
} & UseControllerProps<T>

const DateTimeInputField = <T,>({
  label,
  error,
  textFieldProps,
  dateTimePickerProps,
  ...controllerProps
}: DateTimeInputFieldProps<T>): JSX.Element => {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Controller
        rules={{
          // default rule
          required: 'This field is required',
        }}
        {...controllerProps}
        render={({ field }) => (
          <DateTimePicker
            label={label}
            {...dateTimePickerProps}
            {...field}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...textFieldProps}
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

export default DateTimeInputField
