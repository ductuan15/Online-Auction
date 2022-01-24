import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import { Grid, InputAdornment, TextField, Typography } from '@mui/material'
import {SubmitHandler, useForm, useWatch} from 'react-hook-form'
import { ProductBidFormInput } from '../../../models/bids'
import GenericTextField from '../form/GenericTextField'
import AuctionService from '../../../services/auction.service'
import { setErrorTextMsg } from '../../../utils/error'
import { useIsMounted } from '../../../hooks'
import formatNumberToVND from '../../../utils/currency-format'
import NumberFormat from 'react-number-format'

const dialogName = 'dialog-set-bid-price'

type BidFormProps = {
  setLoading: (value: boolean) => void
  setErrorText: (value: string | null) => void
  onClose: () => void
}

function BidForm({
  setLoading,
  setErrorText,
  onClose,
}: BidFormProps): JSX.Element | null {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductBidFormInput>({
    mode: 'onChange',
    defaultValues: {
      step: '1',
    },
  })

  const {
    state: { currentProduct: product, latestAuction },
  } = useProductContext()

  const step = useWatch({control, name: 'step'})

  const price = useMemo(() => {
    if (isNaN(+step) || !latestAuction?.incrementPrice) {
      return latestAuction?.currentPrice || 0
    }
    return (
      +step * (latestAuction?.incrementPrice ?? 1) +
      +(latestAuction?.currentPrice ?? 0)
    )
  }, [latestAuction?.currentPrice, latestAuction?.incrementPrice, step])

  useEffect(() => {
    setValue('bidPrice', price)
  }, [price, setValue])

  const isMounted = useIsMounted()

  useEffect(() => {
    if (product?.latestAuctionId) {
      setValue('auctionId', product.latestAuctionId)
    }
  }, [product, setValue])

  const onSubmit: SubmitHandler<ProductBidFormInput> = async (data) => {
    if (!product) {
      setErrorTextMsg('Unknown product', setErrorText)
      return
    } else if (!latestAuction) {
      setErrorTextMsg('Auction is not opened', setErrorText)
      return
    }
    // console.log(data)
    if (
      confirm(
        `Are you sure you want to bid this product with ${formatNumberToVND(
          data.bidPrice,
        )}?`,
      )
    ) {
      // console.log(data)
      setLoading(true)
      try {
        const response = await AuctionService.newBid(data)
        if (response) {
          onClose()
        } else {
          setErrorTextMsg('Invalid auction id', setErrorText)
        }
      } catch (e) {
        if (isMounted()) {
          setErrorTextMsg(e, setErrorText)
        }
      } finally {
        if (isMounted()) {
          setLoading(false)
        }
      }
    }
  }

  return latestAuction ? (
    <Grid
      id={`bid-form-${dialogName}`}
      container
      component='form'
      onSubmit={handleSubmit(onSubmit)}
    >
      {/*{!hasPoint && (*/}
      {/*  <BorderButton color='warning' fullWidth sx={{ mt: 2 }}>*/}
      {/*    Request permission from the seller*/}
      {/*  </BorderButton>*/}
      {/*)}*/}

      <Typography color='text.primary' variant='subtitle1' fontWeight={600}>
        Current Price
      </Typography>

      <NumberFormat
        thousandSeparator
        customInput={TextField}
        margin='normal'
        fullWidth
        displayType={'input'}
        value={latestAuction.currentPrice}
        InputProps={{
          startAdornment: <InputAdornment position='start'>₫</InputAdornment>,
          readOnly: true,
        }}
      />

      <Grid
        container
        flexDirection='row'
        justifyContent='center'
        alignItems='center'
      >
        <Grid item xs={4} flexDirection='column'>
          <Typography color='text.primary' variant='subtitle1' fontWeight={600}>
            Step
          </Typography>

          <GenericTextField
            error={errors.step}
            id='step'
            name='step'
            control={control}
            defaultValue={1}
            rules={{
              required: 'This field is required',
              validate: {
                minStep: (value) => {
                  if (latestAuction && latestAuction?.currentPrice === latestAuction?.openPrice) {
                    return +value >= 0 ? true : 'Minimum increment step is 0 (for the first bid)'
                  }
                  return +value >= 1 ? true : 'Minimum increment step is 1'
                },
                intOnly: (value) => {
                  return !!`${value}`.replace(/[^0-9.]/g, '')
                },
              },
            }}
            textFieldProps={{
              type: 'number',
              // disabled: disableAllElement,
              margin: 'normal',
              autoFocus: true,
            }}
          />
        </Grid>

        <Grid item xs={1} flexDirection='column'>
          <Typography color='text.primary' variant='subtitle1' fontWeight={600}>
            &nbsp;
          </Typography>

          <Typography p={3}>×</Typography>
        </Grid>

        <Grid item xs={7} flexDirection='column'>
          <Typography color='text.primary' variant='subtitle1' fontWeight={600}>
            Increment price
          </Typography>

          <NumberFormat
            thousandSeparator
            customInput={TextField}
            margin='normal'
            fullWidth
            value={latestAuction.incrementPrice}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>₫</InputAdornment>
              ),
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
      <Typography
        color='text.primary'
        variant='subtitle1'
        fontWeight={600}
        align='left'
      >
        Your price = Current Price + Step × Increment price
      </Typography>

      <NumberFormat
        thousandSeparator
        customInput={TextField}
        margin='normal'
        fullWidth
        displayType={'input'}
        value={price}
        InputProps={{
          startAdornment: <InputAdornment position='start'>₫</InputAdornment>,
          readOnly: true,
        }}
      />
    </Grid>
  ) : null
}

export default BidForm
