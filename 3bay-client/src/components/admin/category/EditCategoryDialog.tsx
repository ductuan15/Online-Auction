import * as React from 'react'
import Category from '../../../data/category'
import { BaseCategoryDialog } from './BaseCategoryDialog'

export type EditCategoryDialogProps = {
  allCategories?: Array<Category>
  open: boolean
  onCloseCallback: () => void
  category?: Category
}

export function EditCategoryDialog(props: EditCategoryDialogProps) {
  return (
    <BaseCategoryDialog
      open={props.open}
      onCloseCallback={props.onCloseCallback}
      title={'Edit category'}
      dialogName={'edit-create-dialog'}
      allCategories={props.allCategories}
      category={props.category}
    />
  )
}
