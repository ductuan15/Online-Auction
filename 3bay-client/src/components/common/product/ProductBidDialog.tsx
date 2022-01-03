import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import {
  Alert,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import BorderButton from '../button/BorderButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ProductBidFormInput } from '../../../models/bids'
import GenericTextField from '../form/GenericTextField'

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
    state: { isBidDialogOpened, currentProduct: product, score },
    dispatch,
  } = useProductContext()

  const price = +watch('step') * (product?.latestAuction?.currentPrice ?? 1)

  const hasEnoughScore = useMemo(() => {
    return score >= 8
  }, [score])

  useEffect(() => {
    if (product) {
      setValue('bidPrice', price)
    }
  }, [price, product, setValue])

  const onClose = () => {
    dispatch({ type: 'CLOSE_BID_DIALOG' })
  }

  const onSubmit: SubmitHandler<ProductBidFormInput> = (data) => {
    //
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isBidDialogOpened}
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
          {!hasEnoughScore && (
            <Alert severity='warning' sx={{ width: 1 }}>
              You need permission from seller in order to bid this product
            </Alert>
          )}

          {!hasEnoughScore && (
            <BorderButton color='warning' fullWidth sx={{ mt: 2 }}>
              Request permission from the seller
            </BorderButton>
          )}

          {hasEnoughScore && product && product.latestAuction && (
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

          {hasEnoughScore && product?.latestAuction?.buyoutPrice && (
            <BorderButton color='success' fullWidth sx={{ mt: 2 }}>
              💵 DEAL: Buy the product instantly with ₫
              {product?.latestAuction?.buyoutPrice}
            </BorderButton>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        {hasEnoughScore && (
          <Button autoFocus type='submit' form={`category-form-${dialogName}`}>
            Save changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ProductBidDialog
