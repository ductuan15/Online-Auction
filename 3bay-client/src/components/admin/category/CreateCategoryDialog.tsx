import * as React from 'react'
import Category from '../../../data/category'
import { BaseCategoryDialog } from './BaseCategoryDialog'
import axios from 'axios'
import config from '../../../config/config'

type CreateCategoryDialogProps = {
  allCategories?: Array<Category>
  open: boolean
  onCloseCallback: () => void
}

export function CreateCategoryDialog(
  props: CreateCategoryDialogProps,
): JSX.Element {
  return (
    <BaseCategoryDialog
      open={props.open}
      onCloseCallback={props.onCloseCallback}
      title={'Create new category'}
      dialogName={'category-create-dialog'}
      allCategories={props.allCategories}
      submitData={async (formData) => {
        const headerConfig = {
          headers: { 'content-type': 'multipart/form-data' },
        }

        return await axios.post(
          `${config.apiHostName}/api/category/`,
          formData,
          headerConfig,
        )
        // console.log(response)
      }}
    />
  )
}
