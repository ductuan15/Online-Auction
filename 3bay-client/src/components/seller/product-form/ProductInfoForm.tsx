import { Controller, UseFormReturn } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { Divider, Grid } from '@mui/material'
import GenericTextField from '../../common/form/GenericTextField'
import Typography from '@mui/material/Typography'
import WYSIWYGEditor from '../../common/editor/WYSIWYGEditor'
import CategoryChooser from '../../common/form/CategoryChooser'
import ProductThumbnailForm, {MAX_THUMBNAIL_FILE, MIN_THUMBNAIL_FILE} from './ProductThumbnailForm'
import ProductDetailImagesForm, {MAX_DETAILS_FILE, MIN_DETAILS_FILE} from './ProductDetailImagesForm'

type ProductInfoFormProps = {
  disableAllElement: boolean
  useForm: UseFormReturn<ProductFormInput>
}

export default function ProductInfoForm({
  disableAllElement,
  useForm,
}: ProductInfoFormProps): JSX.Element {
  const {
    control,
    formState: { errors },
  } = useForm

  return (
    <>
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
          <ProductThumbnailForm
            disableAllElement={disableAllElement}
            useForm={useForm}
          />
        </Grid>

        <Grid item container xs={12} md={6} px={2} rowSpacing={2}>
          <ProductDetailImagesForm
            disableAllElement={disableAllElement}
            useForm={useForm}
          />
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
    </>
  )
}
