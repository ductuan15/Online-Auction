import { Controller, UseFormReturn, useWatch } from 'react-hook-form'
import { ProductFormInput } from '../../../models/product'
import * as React from 'react'
import { Grid, InputAdornment, Switch } from '@mui/material'
import GenericTextField from '../../common/form/GenericTextField'
import Typography from '@mui/material/Typography'
import { GREY } from '../../../theme/palette'
import DateTimeInputField from '../../common/form/DateTimeInputField'
import moment from 'moment'

type ProductAuctionFormProps = {
  disableAllElement: boolean
  useForm: UseFormReturn<ProductFormInput>
}

export default function ProductAuctionForm({
  disableAllElement,
  useForm,
}: ProductAuctionFormProps): JSX.Element {
  const {
    control,
    formState: { errors },
  } = useForm

  const openPrice = useWatch({ control, name: 'openPrice' })

  return (
    <>
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
      </Grid>
    </>
  )
}
