import { SubmitHandler, useForm } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { Divider, Grid } from '@mui/material'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import BorderButton from '../../common/button/BorderButton'
import ProductInfoForm from '../product-form/ProductInfoForm'
import { useIsMounted } from '../../../hooks'
import ProductAuctionForm from '../product-form/ProductAuctionForm'

type CreateProductFormProps = {
  onSubmit: (formData: FormData) => void
  onError: (e: unknown) => void
}

// TODO refactor this mess
export default function CreateProductForm({
  onSubmit,
  onError,
}: CreateProductFormProps): JSX.Element {
  const form = useForm<ProductFormInput>({
    mode: 'all',
    shouldFocusError: true,
  })

  const {
    handleSubmit,
    formState: { isValid },
  } = form

  const [disableAllElement, setDisableAllElement] = useState(false)
  const isMounted = useIsMounted()

  const submitHandler: SubmitHandler<ProductFormInput> = useCallback(
    async (data) => {
      // console.log(data)
      const formData = new FormData()
      const { thumbnail: thumbnailFileList, detail, ...jsonData } = data

      for (const [key, value] of Object.entries(jsonData)) {
        formData.set(key, value)
      }
      try {
        formData.set('thumbnail', thumbnailFileList[0])

        for (const detailFile of detail) {
          formData.append('detail', detailFile)
        }

        const buyoutPrice = formData.get('buyoutPrice')
        if (typeof buyoutPrice === 'string' && buyoutPrice.length === 0) {
          formData.set('buyoutPrice', 'undefined')
        }
      } catch (e) {
        onError(e)
        return
      }

      // console.log(data)
      // formData.forEach((value, key) => {
      //   console.log(key + ' ' + value)
      // })
      setDisableAllElement(true)
      try {
        await onSubmit(formData)
      } finally {
        if (isMounted()) {
          setDisableAllElement(false)
        }
      }
    },
    [isMounted, onError, onSubmit],
  )

  return (
    <Grid
      container
      component='form'
      noValidate
      maxWidth='md'
      rowSpacing={2}
      onSubmit={handleSubmit(submitHandler)}
    >
      <ProductInfoForm disableAllElement={disableAllElement} useForm={form} />

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <ProductAuctionForm
        disableAllElement={disableAllElement}
        useForm={form}
      />

      <Grid container item xs={12} justifyContent='flex-end'>
        <BorderButton
          type='submit'
          size='large'
          isSelected={isValid ? undefined : true}
          color={isValid ? 'primary' : 'error'}
          disabled={disableAllElement}
        >
          <SaveOutlinedIcon color='inherit' />
          Save changes
        </BorderButton>
      </Grid>
    </Grid>
  )
}
