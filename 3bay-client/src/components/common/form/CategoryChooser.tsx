import { UseControllerProps } from 'react-hook-form/dist/types/controller'
import { Controller, FieldError } from 'react-hook-form'
import * as React from 'react'
import { useMemo } from 'react'
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material'
import { SxProps } from '@mui/system'
import { useCategoryContext } from '../../../contexts/layout/CategoryContext'
import Category from '../../../models/category'
import { ProductFormInput } from '../../../models/product'

type CategoryChooserProps<T> = {
  error: FieldError | undefined
  label?: string
  id?: string
  sx?: SxProps
  selectFieldProps?: SelectProps
} & UseControllerProps<T>

export function renderCategorySelection(
  categories: Category[],
  isParentCategorySelectable?: boolean,
): JSX.Element[] {
  const components: JSX.Element[] = []

  categories.forEach((category) => {
    if (category.otherCategories) {
      if (isParentCategorySelectable) {
        components.push(
          <MenuItem
            value={category.id}
            key={category.id}
            sx={{
              fontWeight: 600,
            }}
          >
            {category.title}
          </MenuItem>,
        )
      } else {
        components.push(
          <ListSubheader key={category.id}>{category.title}</ListSubheader>,
        )
      }
      components.push(...renderCategorySelection(category.otherCategories))
    } else {
      components.push(
        <MenuItem value={category.id} key={category.id}>
          {category.title}
        </MenuItem>,
      )
    }
  })

  return components
}

type FormValues = ProductFormInput

const CategoryChooser = ({
  error,
  label,
  id,
  selectFieldProps,
  sx,
  ...controllerProps
}: CategoryChooserProps<FormValues>): JSX.Element => {
  const {
    state: { allCategories },
  } = useCategoryContext()

  const categories = useMemo(() => {
    // console.log('render categories')
    return renderCategorySelection(allCategories)
  }, [allCategories])

  return (
    <FormControl sx={sx}>
      <InputLabel id={id ?? 'category'}>{label}</InputLabel>
      <Controller
        {...controllerProps}
        render={({ field }) => (
          <Select
            fullWidth
            inputProps={{ style: { fontFamily: 'Jetbrains Mono' } }}
            error={!!error}
            id={id ?? 'category'}
            label={label}
            // value={allCategories.length === 0 ? '' : categories[0].key}
            defaultValue={''}
            {...field}
            {...selectFieldProps}
          >
            {allCategories.length === 0 ? (
              <MenuItem value={''}>
                <em>None</em>
              </MenuItem>
            ) : (
              categories
            )}
          </Select>
        )}
      />
    </FormControl>
  )
}

export default CategoryChooser
