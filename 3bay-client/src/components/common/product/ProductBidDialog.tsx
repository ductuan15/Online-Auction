import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
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

const dialogName = 'dialog-set-bid-price'

function ProductBidDialog(): JSX.Element {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductBidFormInput>({ mode: 'onChange' })

  const {
    state: { isBidDialogOpened, currentProduct: product, point, bidStatus },
    dispatch,
  } = useProductContext()

  const step = watch('step')

  const price = useMemo(() => {
    if (isNaN(+step) || !product?.latestAuction?.incrementPrice) {
      return product?.latestAuction?.currentPrice || 0
    }
    return +step * (product?.latestAuction?.incrementPrice ?? 1)
  }, [
    product,
    step,
  ])

  const hasPoint = useMemo(() => {
    return point !== undefined
  }, [point])

  const [errorText, setErrorText] = useState<string | null>()
  const [isLoading, setLoading] = useState(false)

  const isMounted = useIsMounted()

  useEffect(() => {
    if (product && product.latestAuctionId) {
      setValue('bidPrice', price)
      setValue('auctionId', product.latestAuctionId)
    }
  }, [price, product, setValue])

  const onClose = () => {
    dispatch({ type: 'CLOSE_BID_DIALOG' })
  }

  const onSubmit: SubmitHandler<ProductBidFormInput> = async (data) => {
    console.log(data)
    if (!product) {
      setErrorTextMsg('Unknown product', setErrorText)
      return
    } else if (!product?.latestAuctionId) {
      setErrorTextMsg('Auction is not opened', setErrorText)
      return
    }

    setLoading(true)
    try {
      const response = await AuctionService.newBid(data)
      if (response) {
        const newStatus = await BidderService.getAuctionStatus(
          product.latestAuctionId,
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

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isBidDialogOpened || isLoading}
      onClose={onClose}
      aria-labelledby={dialogName}
    >
      <DialogTitle id={dialogName}>Bid the product</DialogTitle>

      <DialogContent>
        <Grid
          id={`product-form-${dialogName}`}
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

          {(!hasPoint && bidStatus?.status !== 'ACCEPT') && (
            <Alert severity='warning' sx={{ width: 1 }}>
              You need permission from seller in order to bid this product
            </Alert>
          )}

          {/*{!hasPoint && (*/}
          {/*  <BorderButton color='warning' fullWidth sx={{ mt: 2 }}>*/}
          {/*    Request permission from the seller*/}
          {/*  </BorderButton>*/}
          {/*)}*/}

          {product && product.latestAuction && (
            <>
              <Typography
                color='text.primary'
                variant='subtitle1'
                fontWeight={600}
              >
                Your price
              </Typography>

              <GenericTextField
                error={errors.bidPrice}
                id='bidPrice'
                name='bidPrice'
                control={control}
                defaultValue={product.latestAuction.currentPrice}
                textFieldProps={{
                  type: 'number',
                  // disabled: disableAllElement,
                  margin: 'normal',
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position='start'>₫</InputAdornment>
                    ),
                  },
                  disabled: true,
                }}
              />

              <Grid
                container
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
              >
                <Grid item xs={4}>
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

                <Grid item xs={1}>
                  <Typography p={3}>×</Typography>
                </Grid>

                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    type='number'
                    margin='normal'
                    defaultValue={product.latestAuction.incrementPrice}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>₫</InputAdornment>
                      ),
                    }}
                    disabled
                  />
                </Grid>
              </Grid>
            </>
          )}

          {hasPoint && product?.latestAuction?.buyoutPrice && (
            <BorderButton color='success' fullWidth sx={{ mt: 2 }}>
              💵 DEAL: Buy the product instantly with ₫
              {product?.latestAuction?.buyoutPrice}
            </BorderButton>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        {/*{hasPoint && (*/}
        <Button
          type='submit'
          form={`product-form-${dialogName}`}
          disabled={isLoading}
        >
          Save changes
        </Button>
        {/*)}*/}
      </DialogActions>
    </Dialog>
  )
}

export default ProductBidDialog
