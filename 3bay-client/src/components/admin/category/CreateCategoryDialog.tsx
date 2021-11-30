import * as React from 'react'
import Category from '../../../data/category'
import { BaseCategoryDialog } from './BaseCategoryDialog'

type CreateCategoryDialogProps = {
  allCategories?: Array<Category>
  open: boolean
  onCloseCallback: () => void
}

export function CreateCategoryDialog(props: CreateCategoryDialogProps) {
  return (
    <BaseCategoryDialog
      open={props.open}
      onCloseCallback={props.onCloseCallback}
      title={'Create new category'}
      dialogName={'category-create-dialog'}
      allCategories={props.allCategories}
    />
  )
}
