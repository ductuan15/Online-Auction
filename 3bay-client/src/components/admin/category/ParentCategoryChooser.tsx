import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Category from '../../../data/category'
import { FormHelperText } from '@mui/material'

export type ParentCategoryChooserProps = {
  allCategories?: Array<Category>
  currentCategory?: Category
}

export default function ParentCategoryChooser({
  allCategories,
  currentCategory,
}: ParentCategoryChooserProps): JSX.Element {
  let initialValue = '-1'
  if (currentCategory && currentCategory.parentId) {
    initialValue = `${currentCategory.parentId}`
  }
  const [cat, setCat] = React.useState(initialValue)
  // console.log(currentCategory)

  const handleChange = (event: SelectChangeEvent) => {
    setCat(event.target.value as string)
  }

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id='parent-category-chooser'>Sub-category of</InputLabel>
        <Select
          name='parentId'
          disabled={!allCategories || allCategories.length == 0}
          labelId='parent-category-chooser'
          id='parent-category-select'
          value={cat}
          label='Sub-category of'
          onChange={handleChange}
        >
          <MenuItem key={'-1'} value={'-1'}>
            None
          </MenuItem>
          {allCategories
            ?.filter((category) => {
              // should not render currentCategory option
              return (
                !currentCategory ||
                (currentCategory && currentCategory.id !== category.id)
              )
            })
            .map((category) => {
              return (
                <MenuItem key={category.id} value={`${category.id}`}>
                  {category.title}
                </MenuItem>
              )
            })}
        </Select>
        {(!allCategories || allCategories.length == 0) && (
          <FormHelperText>There is no category to choose</FormHelperText>
        )}
      </FormControl>
    </Box>
  )
}
