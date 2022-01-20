import * as React from 'react'
import {useCallback} from 'react'
import {BaseCategoryDialog} from './BaseCategoryDialog'
import {useCategoryContext} from '../../../contexts/layout/CategoryContext'
import Category from '../../../models/category'
import axiosApiInstance from '../../../services/api'
import {AxiosPromise} from 'axios'

// export type EditCategoryDialogProps = {}

export const EditCategoryDialog = (): JSX.Element => {
  const { state } = useCategoryContext()
  const { openEditDialog } = state

  const onDataSubmitted: (
    formData: FormData,
    category: Category | undefined,
  ) => AxiosPromise = useCallback(async (formData, category) => {
    if (!category) throw Error('Update category but the id is unknown')
    const headerConfig = {
      headers: { 'content-type': 'multipart/form-data' },
    }

    //console.log(editedCategory)
    return await axiosApiInstance.patch(
      `/api/category/${category.id}`,
      formData,
      headerConfig,
    )
  }, [])

  return (
    <BaseCategoryDialog
      open={openEditDialog}
      title={'Edit category'}
      dialogName={'edit-create-dialog'}
      submitData={onDataSubmitted}
    />
  )
}
