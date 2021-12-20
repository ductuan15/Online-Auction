import * as React from 'react'
import { BaseCategoryDialog } from './BaseCategoryDialog'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import Category from '../../../data/category'
import axiosApiInstance from '../../../services/api'

// export type EditCategoryDialogProps = {}

export const EditCategoryDialog = (): JSX.Element => {
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

        const response = await axiosApiInstance.patch(
          `/api/category/${category.id}`,
          formData,
          headerConfig,
        )

        const editedCategory = {
          ...new Category(response.data),
          // response does not include otherCategories key
          otherCategories: category.otherCategories,
        }
        //console.log(editedCategory)

        updateCategory(category, editedCategory)

        return response
      }}
    />
  )
}
