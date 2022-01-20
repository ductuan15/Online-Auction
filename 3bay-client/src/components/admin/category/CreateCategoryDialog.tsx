import * as React from 'react'
import { useCallback } from 'react'
import { BaseCategoryDialog } from './BaseCategoryDialog'
import { useCategoryContext } from '../../../contexts/layout/CategoryContext'
import Category from '../../../models/category'
import axiosApiInstance from '../../../services/api'
import { AxiosPromise } from 'axios'

// type CreateCategoryDialogProps = {}

export function CreateCategoryDialog(): JSX.Element {
  const {
    state: { openCreateDialog },
  } = useCategoryContext()

  const onDataSubmitted: (
    formData: FormData,
    category: Category | undefined,
  ) => AxiosPromise = useCallback(async (formData) => {
    const headerConfig = {
      headers: { 'content-type': 'multipart/form-data' },
    }

    return await axiosApiInstance.post(`/api/category/`, formData, headerConfig)
  }, [])

  return (
    <BaseCategoryDialog
      open={openCreateDialog}
      title={'Create new category'}
      dialogName={'category-create-dialog'}
      submitData={onDataSubmitted}
    />
  )
}
