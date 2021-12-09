import * as React from 'react'
import { BaseCategoryDialog } from './BaseCategoryDialog'
import axios from 'axios'
import config from '../../../config/config'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import Category from '../../../data/category'

// type CreateCategoryDialogProps = {}

export function CreateCategoryDialog(): JSX.Element {
  const { state, addCategory } = useCategoryContext()
  const { openCreateDialog } = state

  return (
    <BaseCategoryDialog
      open={openCreateDialog}
      title={'Create new category'}
      dialogName={'category-create-dialog'}
      submitData={async (formData) => {
        const headerConfig = {
          headers: { 'content-type': 'multipart/form-data' },
        }

        const response = await axios.post(
          `${config.apiHostName}/api/category/`,
          formData,
          headerConfig,
        )
        const category = new Category(response.data)
        console.log(category)

        addCategory(category)
        // console.log(response)

        return response
      }}
    />
  )
}
