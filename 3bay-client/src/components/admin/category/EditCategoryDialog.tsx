import * as React from 'react'
import Category from '../../../data/category'
import { BaseCategoryDialog } from './BaseCategoryDialog'
import axios from 'axios'
import config from '../../../config/config'

export type EditCategoryDialogProps = {
  allCategories?: Array<Category>
  open: boolean
  onCloseCallback: () => void
  category?: Category
}

export function EditCategoryDialog(props: EditCategoryDialogProps): JSX.Element {
  return (
    <BaseCategoryDialog
      open={props.open}
      onCloseCallback={props.onCloseCallback}
      title={'Edit category'}
      dialogName={'edit-create-dialog'}
      allCategories={props.allCategories}
      category={props.category}
      submitData={async (formData, category) => {
        if (!category) throw Error('Update category but the id is unknown')
        const headerConfig = {
          headers: { 'content-type': 'multipart/form-data' },
        }

        return await axios.patch(`${config.apiHostName}/api/category/${category.id}`, formData, headerConfig)
        // console.log(response)
      }}
    />
  )
}
