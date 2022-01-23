import { UseFormReturn, useWatch } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { styled } from '@mui/material/styles'
import { useIsMounted } from '../../../hooks'
import CloseIcon from '@mui/icons-material/Close'
import {FieldPath} from 'react-hook-form/dist/types/path'

const Input = styled('input')({
  display: 'none',
})

const Label = styled('label')({})

export const MIN_DETAILS_FILE = 2
export const MAX_DETAILS_FILE = 6

type ProductDetailImagesFormProps = {
  disableAllElement: boolean
  useForm: UseFormReturn<ProductFormInput>
}

export default function ProductDetailImagesForm({
  disableAllElement,
  useForm,
}: ProductDetailImagesFormProps): JSX.Element {
  const {
    register,
    getValues,
    setValue,
    setError,
    clearErrors,
    control,
    trigger,
    formState: { errors, touchedFields },
  } = useForm

  const detailsField = useMemo(() => {
    return register('detail', {
      required: 'This field is required',
    })
  }, [register])

  const onDetailFilesChanged = useCallback(
    async (e) => {
      if (e.target.files) {
        const details = getValues('detail')
        let files = [
          ...(Array.from(details) as File[]),
          ...Array.from(e.target.files),
        ] as File[]
        if (files.length > MAX_DETAILS_FILE) {
          files = files.slice(0, MAX_DETAILS_FILE)
        }
        // detailsField.onChange(e)
        setValue('detail', files, {shouldTouch: true})
        const fields = Object.entries(touchedFields).filter(([, value]) => {
          return value
        }).map(([key]) => key)
        await trigger(fields as FieldPath<ProductFormInput>[])
      }
    },
    [getValues, setValue, touchedFields, trigger],
  )

  const detailFiles = useWatch({ control, name: 'detail' })

  const [detailImages, setDetailImages] = useState<string[]>([])
  const isMounted = useIsMounted()

  const onRemoveImageButtonClicked = useCallback(
    (idx: number) => () => {
      setValue(
        'detail',
        getValues('detail').filter((file, i) => i !== idx),
        {shouldTouch: true}
      )
    },
    [getValues, setValue],
  )

  const imageList = useMemo(() => {
    return detailImages.length !== 0 ? (
      <ImageList sx={{ height: 256 }} cols={3} rowHeight={128}>
        {detailImages.map((item, idx) => (
          <ImageListItem key={idx}>
            <img src={item} alt={item} height={128} />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              position='top'
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  onClick={onRemoveImageButtonClicked(idx)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    ) : null
  }, [detailImages, onRemoveImageButtonClicked])

  useEffect(() => {
    ;(async () => {
      if (isMounted() && detailFiles) {
        const imgFiles: Array<string> = []
        for (let i = 0; i < detailFiles.length; i++) {
          imgFiles.push(URL.createObjectURL(detailFiles[i]))
        }
        setDetailImages(imgFiles)
        if (touchedFields.detail && imgFiles.length < MIN_DETAILS_FILE) {
          setError('detail', {
            message: `You must choose at least ${MIN_DETAILS_FILE} photos`,
          })
        } else {
          clearErrors('detail')
        }
      }
    })()
  }, [clearErrors, detailFiles, isMounted, setError, touchedFields.detail])

  return (
    <>
      {errors.detail && (
        <Grid item xs={12}>
          {/* eslint-disable @typescript-eslint/no-explicit-any */}
          <Alert severity='error'>{(errors.detail as any).message}</Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Label htmlFor='button-detail-file'>
          <Input
            accept='image/jpeg'
            id='button-detail-file'
            type='file'
            multiple={true}
            max={MAX_DETAILS_FILE}
            disabled={disableAllElement}
            style={{
              display: 'none',
            }}
            // onChange={onImageChange}
            {...detailsField}
            onChange={onDetailFilesChanged}
          />

          <Button
            sx={{ width: 1 }}
            startIcon={<ImageOutlinedIcon />}
            variant='outlined'
            component='span'
            disabled={disableAllElement}
          >
            Choose more images
          </Button>
        </Label>
      </Grid>

      <Grid
        item
        container
        mt={1}
        xs={12}
        sx={{
          border: detailImages.length ? 'none' : `1px dashed`,
          height: detailImages.length ? 'auto' : 256,
        }}
      >
        {imageList}
      </Grid>

      <Grid item xs={12}>
        <Typography variant='caption' color='text.secondary'>
          These images will be displayed in the product details page, customers
          will see when they click to your product.
        </Typography>
      </Grid>
    </>
  )
}
