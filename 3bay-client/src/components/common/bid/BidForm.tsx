import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import {
  Alert,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material'
import BorderButton from '../button/BorderButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ProductBidFormInput } from '../../../models/bids'
import GenericTextField from '../form/GenericTextField'
import AuctionService from '../../../services/auction.service'
import { setErrorTextMsg } from '../../../utils/error'
import BidderService from '../../../services/bidder.service'
import { useIsMounted } from '../../../hooks'
import formatNumberToVND from '../../../utils/currency-format'
import NumberFormat from 'react-number-format'

const dialogName = 'dialog-set-bid-price'

type BidDialogProps = {
  isLoading: boolean
  setLoading: (value: boolean) => void
  errorText: string | null
  setErrorText: (value: string | null) => void
}

function BidDialog({
  isLoading,
  setLoading,
  errorText,
  setErrorText,
}: BidDialogProps): JSX.Element | null {
  const {
    control,
    watch,
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
    state: { currentProduct: product, userPoint, bidStatus, latestAuction },
    dispatch,
  } = useProductContext()

  const step = watch('step')

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

  const hasPoint = useMemo(() => {
    return userPoint !== undefined
  }, [userPoint])

  const isMounted = useIsMounted()

  useEffect(() => {
    if (product?.latestAuctionId) {
      setValue('auctionId', product.latestAuctionId)
    }
  }, [product, setValue])

  const onClose = useCallback(() => {
    // if (isMounted()) {
    setErrorText(null)
    // }
    dispatch({ type: 'CLOSE_BID_DIALOG' })
  }, [dispatch, setErrorText])

  const onSubmit: SubmitHandler<ProductBidFormInput> = async (data) => {
    if (!product) {
      setErrorTextMsg('Unknown product', setErrorText)
      return
    } else if (!product?.latestAuctionId) {
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
          const newStatus = await BidderService.getAuctionStatus(
            product?.latestAuctionId,
          )
          dispatch({ type: 'UPDATE_BID_STATUS', payload: newStatus })
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
      {isLoading && (
        <LinearProgress variant='indeterminate' sx={{ width: 1 }} />
      )}

      {errorText && (
        <Alert severity='error' sx={{ width: 1, mb: 1 }}>
          {errorText}
        </Alert>
      )}

      {!hasPoint && bidStatus?.status !== 'ACCEPT' && (
        <Alert severity='warning' sx={{ width: 1 }}>
          You need permission from seller in order to bid this product
        </Alert>
      )}

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
              min: {
                value: 1,
                message: 'Minimum increment step is 1',
              },
              validate: {
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

      {latestAuction?.buyoutPrice && (
        <BorderButton color='success' fullWidth sx={{ mt: 2 }}>
          💵 DEAL: Buy the product instantly with{' '}
          {formatNumberToVND(latestAuction?.buyoutPrice || 0)}
        </BorderButton>
      )}
    </Grid>
  ) : null
}

export default BidDialog