import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
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
import CategoryChooser from '../../common/form/CategoryChooser'
import CloseIcon from '@mui/icons-material/Close'
import BorderButton from '../../common/button/BorderButton'

const Input = styled('input')({
  display: 'none',
})

const Label = styled('label')({})

const MIN_THUMBNAIL_FILE = 1
const MIN_DETAILS_FILE = 2
const MAX_DETAILS_FILE = 6
const MAX_THUMBNAIL_FILE = 1

type CreateProductFormProps = {
  onSubmit: (formData: FormData) => void
  onError: (e: unknown) => void
}

// TODO refactor this mess
export default function CreateProductForm({
  onSubmit,
  onError,
}: CreateProductFormProps): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ProductFormInput>({
    mode: 'all',
    shouldFocusError: true,
  })

  const detailsField = register('detail', {
    required: 'This field is required',
  })

  const onDetailFilesChanged = useCallback(
    (e) => {
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
        setValue('detail', files)
      }
    },
    [getValues, setValue],
  )

  const [disableAllElement, setDisableAllElement] = useState(false)

  const openPrice = watch('openPrice')

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
      if (imgFiles?.length && imgFiles.length < MIN_DETAILS_FILE) {
        setError('detail', {
          message: `You must choose at least ${MIN_DETAILS_FILE} photos`,
        })
      } else {
        clearErrors('detail')
      }
    }
  }, [clearErrors, detailFiles, isMounted, setError])

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
            disabled: disableAllElement,
            margin: 'normal',
          }}
        />
      </Grid>

      <Grid item container xs={12} flexDirection='column' rowSpacing={3}>
        <Typography color='text.primary' variant='h6'>
          Category
        </Typography>

        <CategoryChooser
          rules={{
            required: 'This field is required',
          }}
          error={errors.categoryId}
          id={'categoryId'}
          name={'categoryId'}
          control={control}
          defaultValue={''}
          selectFieldProps={{
            disabled: disableAllElement,
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
            {`Choose at least ${
              MIN_THUMBNAIL_FILE + MIN_DETAILS_FILE
            } photos (maximum of ${
              MAX_DETAILS_FILE + MAX_THUMBNAIL_FILE
            } photos)`}
          </Typography>
        </Grid>

        <Grid item container xs={12} md={6} px={2} rowSpacing={2}>
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
              This image will be the first photo customers will see when they
              view your product
            </Typography>
          </Grid>
        </Grid>

        <Grid item container xs={12} md={6} px={2} rowSpacing={2}>
          {errors.detail && (
            <Grid item xs={12}>
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
            {detailImages.length !== 0 && (
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
                          onClick={() => {
                            setValue(
                              'detail',
                              getValues('detail').filter(
                                (file, i) => i !== idx,
                              ),
                            )
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    />
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
                  paddingLeft: 15,
                  paddingRight: 15,
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
              defaultValue={10_000}
              rules={{
                required: 'This field is required',
                min: {
                  value: 10_000,
                  message: 'Minimum increment price is 10,000',
                },
              }}
              textFieldProps={{
                type: 'number',
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
              defaultValue={5_000}
              rules={{
                min: {
                  value: 5_000,
                  message: 'Minimum increment price is 50,000',
                },
                required: 'This field is required',
              }}
              textFieldProps={{
                type: 'number',
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
              defaultValue={''}
              rules={{
                validate: {
                  number: (value) => {
                    if (
                      !value ||
                      (typeof value === 'string' && value.length === 0)
                    ) {
                      return true
                    }
                    if (isNaN(+value)) {
                      return 'Wrong number format'
                    }
                  },
                  largerThanOpenPrice: (value) => {
                    if (
                      value &&
                      !isNaN(+value) &&
                      openPrice &&
                      !isNaN(+openPrice) &&
                      +value < +openPrice
                    ) {
                      return 'Instant buyout price should be larger than Starting Bid price'
                    }
                    return true
                  },
                },
              }}
              textFieldProps={{
                // type: 'number',
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

        {/* closeTime */}
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
                rules={{
                  required: 'This field is required',
                  validate: {
                    afterNow: (date) => {
                      if (
                        moment.isMoment(date) &&
                        !moment(date).subtract(1, 'day').isAfter()
                      ) {
                        // console.log(moment(date).subtract(1, 'day'))
                        return 'The auction should last at least 1 day from the current time'
                      }
                      return true
                    },
                  },
                }}
                dateTimePickerProps={{
                  minDateTime: moment().add(1, 'day').add(1, 'hour'),
                  disabled: disableAllElement,
                }}
                textFieldProps={{
                  disabled: disableAllElement,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* autoExtendAuctionTiming */}
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
          <BorderButton
            type='submit'
            size='large'
            isSelected={isValid ? undefined : true}
            color={isValid ? 'primary' : 'error'}
          >
            <SaveOutlinedIcon color='inherit' />
            Save changes
          </BorderButton>
        </Grid>
      </Grid>
    </Grid>
  )
}
