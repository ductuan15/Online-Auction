import { useForm } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Divider, Grid, ImageList, ImageListItem } from '@mui/material'
import GenericTextField from '../../common/form/GenericTextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { styled } from '@mui/material/styles'
import {useIsMounted} from '../../../hooks'

const Input = styled('input')({
  display: 'none',
})

const Label = styled('label')({})

export default function CreateProductForm(): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput>()

  const [disableSubmit, setDisableSubmit] = useState(true)
  const [disableAllElement, setDisableAllElement] = useState(false)

  const [thumbnail, setThumbnail] = useState<string>('')

  const thumbnailFile = watch('thumbnail')
  useEffect(() => {
    setThumbnail(
      thumbnailFile && thumbnailFile.length
        ? URL.createObjectURL(thumbnailFile[0])
        : '',
    )
  }, [thumbnailFile])

  const detailFiles = watch('detail')
  const [detailImages, setDetailImages] = useState<string[]>([])
  const isMounted = useIsMounted()

  useEffect(() => {
    if (isMounted() && detailFiles) {
      const imgFiles: Array<string> = []
      for (let i = 0; i < detailFiles.length; i++) {
        imgFiles.push(URL.createObjectURL(detailFiles[i]))
      }
      setDetailImages(imgFiles)
    }
  }, [detailFiles, isMounted])

  return (
    <Grid container component='form' noValidate maxWidth='md' rowSpacing={2}>
      <Grid item container xs={12}>
        <Typography color='text.primary' variant='h6'>
          Product name
        </Typography>

        <GenericTextField
          error={errors.name}
          id='name'
          name='name'
          control={control}
          defaultValue=''
          rules={{
            required: 'This field is required',
            maxLength: {
              value: 80,
              message: 'Maximum length exceeded (over 80 characters)',
            },
            validate: {
              emptyString: (value) => {
                return (
                  (typeof value === 'string' && value.trim().length > 0) ||
                  'Name should not be empty'
                )
              },
            },
          }}
          textFieldProps={{
            autoFocus: true,
            disabled: disableAllElement,
            margin: 'normal',
          }}
          normalHelperText={
            'Use words people would search for when using your item.'
          }
        />
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item container xs={12} rowSpacing={2}>
        <Grid item xs={12}>
          <Typography color='text.primary' variant='h6'>
            Add a photo
          </Typography>
        </Grid>

        <Grid item container xs={12} md={6} px={2} rowSpacing={1}>
          <Grid item xs={12}>
            <Label htmlFor='button-thumbnail-file'>
              <Input
                accept='image/jpeg'
                id='button-thumbnail-file'
                type='file'
                style={{
                  display: 'none',
                }}
                // onChange={onImageChange}
                {...register('thumbnail')}
              />

              <Button
                sx={{ width: 1 }}
                startIcon={<ImageOutlinedIcon />}
                variant='outlined'
                component='span'
              >
                Choose thumbnail
              </Button>
            </Label>
          </Grid>

          <Grid item container xs={12} height='256px' justifyContent='center'>
            <img
              src={thumbnail}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              alt={'Thumbnail'}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant='caption' color='text.secondary'>
              This image will be the first photo customers will see when they
              view your product
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} px={2}>
          <Grid item xs={12}>
            <Label htmlFor='button-detail-file'>
              <Input
                accept='image/jpeg'
                id='button-detail-file'
                type='file'
                multiple={true}
                max={6}
                style={{
                  display: 'none',
                }}
                // onChange={onImageChange}
                {...register('detail')}
              />

              <Button
                sx={{ width: 1 }}
                startIcon={<ImageOutlinedIcon />}
                variant='outlined'
                component='span'
              >
                Choose more images
              </Button>
            </Label>
          </Grid>

          <Grid item xs={12}>
            <ImageList
              sx={{ height: 256 }}
              cols={3}
              rowHeight={128}
            >
              {detailImages.map((item) => (
                <ImageListItem key={item}>
                  <img src={item} alt={item} height={128} />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
