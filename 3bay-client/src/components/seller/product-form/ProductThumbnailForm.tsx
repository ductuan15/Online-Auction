import { UseFormReturn, useWatch } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Alert, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { styled } from '@mui/material/styles'

const Input = styled('input')({
  display: 'none',
})

const Label = styled('label')({})

export const MIN_THUMBNAIL_FILE = 1
export const MAX_THUMBNAIL_FILE = 1

type ProductThumbnailFormProps = {
  disableAllElement: boolean
  useForm: UseFormReturn<ProductFormInput>
}

export default function ProductThumbnailForm({
  disableAllElement,
  useForm,
}: ProductThumbnailFormProps): JSX.Element {
  const {
    control,
    register,
    formState: { errors },
  } = useForm
  const thumbnailFile = useWatch({ control, name: 'thumbnail' })
  const [thumbnail, setThumbnail] = useState<string>('')

  useEffect(() => {
    setThumbnail(
      thumbnailFile && thumbnailFile.length
        ? URL.createObjectURL(thumbnailFile[0])
        : '',
    )
  }, [thumbnailFile])

  return (
    <>
      {errors.thumbnail && (
        <Grid item xs={12}>
          <Alert severity='error'>{errors.thumbnail.message}</Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Label htmlFor='button-thumbnail-file'>
          <Input
            accept='image/jpeg'
            id='button-thumbnail-file'
            type='file'
            style={{
              display: 'none',
            }}
            disabled={disableAllElement}
            // onChange={onImageChange}
            {...register('thumbnail', {
              required: 'This field is required',
              validate: {
                minFile: (value) => {
                  if (
                    value instanceof FileList &&
                    value.length < MIN_THUMBNAIL_FILE
                  ) {
                    return 'You must choose a thumbnail for your product'
                  }
                },
              },
            })}
          />

          <Button
            sx={{ width: 1 }}
            startIcon={<ImageOutlinedIcon />}
            variant='outlined'
            component='span'
            disabled={disableAllElement}
          >
            Choose thumbnail
          </Button>
        </Label>
      </Grid>

      <Grid
        item
        container
        mt={1}
        xs={12}
        height={256}
        justifyContent='center'
        sx={{
          border: thumbnail ? 'none' : `1px dashed`,
        }}
      >
        {thumbnail && (
          <img
            src={thumbnail}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            alt={'Thumbnail'}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant='caption' color='text.secondary'>
          This image will be the first photo customers will see when they view
          your product
        </Typography>
      </Grid>
    </>
  )
}
