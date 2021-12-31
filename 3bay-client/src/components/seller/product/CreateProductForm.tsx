import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  InputAdornment,
  Switch,
} from '@mui/material'
import GenericTextField from '../../common/form/GenericTextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { styled } from '@mui/material/styles'
import { useIsMounted } from '../../../hooks'
import WYSIWYGEditor from '../../common/editor/WYSIWYGEditor'
import { GREY } from '../../../theme/palette'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import DateTimeInputField from '../../common/form/DateTimeInputField'
import moment from 'moment'

const Input = styled('input')({
  display: 'none',
})

const Label = styled('label')({})

type CreateProductFormProps = {
  onSubmit?: (formData: FormData) => void
}

// TODO refactor me
export default function CreateProductForm({
  onSubmit,
}: CreateProductFormProps): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput>({
    mode: 'onChange',
  })

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

  const submitHandler: SubmitHandler<ProductFormInput> = (data) => {
    console.log(data)
    setDisableAllElement(true)
    if (onSubmit) {
      setDisableAllElement(true)
      //
    }
  }

  return (
    <Grid
      container
      component='form'
      noValidate
      maxWidth='md'
      rowSpacing={2}
      onSubmit={handleSubmit(submitHandler)}
    >
      {/* name */}
      <Grid item container xs={12}>
        <Grid item xs={12}>
          <Typography
            color='text.primary'
            variant='h4'
            fontWeight={600}
            gutterBottom
          >
            Product Info
          </Typography>

          <Typography color='text.primary' variant='h6'>
            Product name
          </Typography>

          <Typography color='text.secondary' variant='body1'>
            Use words people would search for when using your item.
          </Typography>
        </Grid>

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
        />
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item container xs={12} rowSpacing={2}>
        <Grid item xs={12}>
          <Typography color='text.primary' variant='h6'>
            Add photos
          </Typography>

          <Typography color='text.secondary' variant='body1'>
            Choose at least 3 photos (maximum of 7 photos)
          </Typography>
        </Grid>

        <Grid item container xs={12} md={6} px={2} rowSpacing={2}>
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
              This image will be the first photo customers will see when they
              view your product
            </Typography>
          </Grid>
        </Grid>

        <Grid item container xs={12} md={6} px={2} rowSpacing={2}>
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
            {detailImages.length !== 0 && (
              <ImageList sx={{ height: 256 }} cols={3} rowHeight={128}>
                {detailImages.map((item) => (
                  <ImageListItem key={item}>
                    <img src={item} alt={item} height={128} />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant='caption' color='text.secondary'>
              These images will be displayed in the product details page,
              customers will see when they click to your product.
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={12}>
          <Typography color='text.primary' variant='h6'>
            Add description
          </Typography>

          <Typography color='text.secondary' variant='body1' gutterBottom>
            Tell buyers about unique features, flaws, or why you are selling it!
            <br />
            <i>
              Please review your description carefully since description can not
              be changed after posting the product.
            </i>
          </Typography>
        </Grid>

        <Grid item xs={12} mt={2}>
          <Controller
            control={control}
            name='description'
            defaultValue={''}
            render={({ field }) => (
              <WYSIWYGEditor
                // value={field.value}
                onChange={field.onChange}
                editorStyle={{
                  minHeight: 256,
                }}
                readOnly={disableAllElement}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item container xs={12} rowSpacing={2}>
        <Grid item xs={12}>
          <Typography
            color='text.primary'
            variant='h4'
            fontWeight={600}
            gutterBottom
          >
            Auction
          </Typography>

          <Typography color='text.primary' variant='h6'>
            Pricing
          </Typography>

          <Typography color='text.secondary' variant='body1' gutterBottom>
            Set a starting amount and let buyers compete for your item.
          </Typography>
        </Grid>

        <Grid
          item
          container
          xs={12}
          sx={{ background: GREY[500_8] }}
          padding={2}
        >
          <Grid item xs={0} md={1} />
          <Grid item container xs={12} md={5} flexDirection='column'>
            <Typography
              color='text.primary'
              variant='subtitle1'
              fontWeight={600}
            >
              Starting Bid
            </Typography>

            <Typography color='text.secondary' variant='body1' gutterBottom>
              To attract buyers and increase competition for your item, consider
              a low starting bid.
            </Typography>
          </Grid>

          {/* openPrice */}
          <Grid item xs={12} md={4} justifyContent='center'>
            <GenericTextField
              error={errors.openPrice}
              id='openPrice'
              name='openPrice'
              control={control}
              defaultValue={0}
              rules={{
                required: 'This field is required',
              }}
              textFieldProps={{
                disabled: disableAllElement,
                margin: 'normal',
                InputProps: {
                  startAdornment: (
                    <InputAdornment position='start'>₫</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>

        {/* incrementPrice */}
        <Grid item container xs={12} md={6} pr={1}>
          <Grid item xs={12} flexDirection='column'>
            <Typography
              color='text.primary'
              variant='subtitle1'
              fontWeight={600}
            >
              Increment price
            </Typography>

            <GenericTextField
              error={errors.incrementPrice}
              id='incrementPrice'
              name='incrementPrice'
              control={control}
              defaultValue={10_000}
              rules={{
                min: {
                  value: 10_000,
                  message: 'Minimum increment price is 10,000',
                },
                required: 'This field is required',
              }}
              textFieldProps={{
                disabled: disableAllElement,
                margin: 'normal',
                InputProps: {
                  startAdornment: (
                    <InputAdornment position='start'>₫</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>

        {/* buyoutPrice */}
        <Grid item container xs={12} md={6} pl={1}>
          <Grid item xs={12} flexDirection='column'>
            <Typography
              color='text.primary'
              variant='subtitle1'
              fontWeight={600}
            >
              (Optional) Instant buyout price
            </Typography>

            <GenericTextField
              error={errors.buyoutPrice}
              id='buyoutPrice'
              name='buyoutPrice'
              control={control}
              defaultValue={undefined}
              textFieldProps={{
                disabled: disableAllElement,
                margin: 'normal',
                InputProps: {
                  startAdornment: (
                    <InputAdornment position='start'>₫</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid item container xs={12} md={6} pr={1}>
          <Grid item xs={12} flexDirection='column'>
            <Typography
              color='text.primary'
              variant='subtitle1'
              fontWeight={600}
            >
              Close time
            </Typography>

            <Grid item xs={12}>
              <DateTimeInputField
                error={errors.closeTime}
                name='closeTime'
                control={control}
                defaultValue={null}
                dateTimePickerProps={{
                  minDateTime: moment(),
                  disabled: disableAllElement,
                }}
                textFieldProps={{
                  disabled: disableAllElement,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} pl={1} alignSelf='center'>
          <Grid item xs={12} flexDirection='column'>
            <Typography
              color='text.primary'
              variant='subtitle1'
              fontWeight={600}
            >
              Auto extend auction timing
            </Typography>

            <Controller
              control={control}
              name='autoExtendAuctionTiming'
              defaultValue={false}
              render={({ field }) => (
                <Switch disabled={disableAllElement} {...field} />
              )}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid container item xs={12} justifyContent='flex-end'>
          <Button
            variant='contained'
            type='submit'
            size='large'
            startIcon={<SaveOutlinedIcon />}
          >
            Save changes
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
