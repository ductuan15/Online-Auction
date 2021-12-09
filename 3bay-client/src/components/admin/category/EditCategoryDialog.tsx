import * as React from 'react'
import { FC } from 'react'
import { BaseCategoryDialog } from './BaseCategoryDialog'
import axios from 'axios'
import config from '../../../config/config'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import Category from '../../../data/category'

// export type EditCategoryDialogProps = {}

export const EditCategoryDialog: FC = () => {
  const { state, updateCategory } = useCategoryContext()
  const { openEditDialog } = state

  return (
    <BaseCategoryDialog
      open={openEditDialog}
      title={'Edit category'}
      dialogName={'edit-create-dialog'}
      submitData={async (formData, category) => {
        if (!category) throw Error('Update category but the id is unknown')
        const headerConfig = {
          headers: { 'content-type': 'multipart/form-data' },
        }

        const response = await axios.patch(
          `${config.apiHostName}/api/category/${category.id}`,
          formData,
          headerConfig,
        )

        const editedCategory = {
          ...new Category(response.data),
          // response does not include otherCategories key
          otherCategories: category.otherCategories,
        }
        console.log(editedCategory)

        updateCategory(editedCategory)

        return response
      }}
    />
  )
}
