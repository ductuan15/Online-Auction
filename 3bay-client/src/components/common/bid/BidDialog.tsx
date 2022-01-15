import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import BidForm from './BidForm'
import { Alert, Grid, LinearProgress } from '@mui/material'
import BorderButton from '../button/BorderButton'
import formatNumberToVND from '../../../utils/currency-format'

const dialogName = 'dialog-set-bid-price'

function BidDialog(): JSX.Element {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const {
    state: { isBidDialogOpened, latestAuction, userPoint, bidStatus },
    dispatch,
  } = useProductContext()

  const hasPoint = useMemo(() => {
    return userPoint !== undefined
  }, [userPoint])

  const [errorText, setErrorText] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)

  const onClose = useCallback(() => {
    // if (isMounted()) {
    setErrorText(null)
    // }
    dispatch({ type: 'CLOSE_BID_DIALOG' })
  }, [dispatch])

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isBidDialogOpened || isLoading}
      onClose={onClose}
      aria-labelledby={dialogName}
    >
      <DialogTitle id={dialogName}>Bid the product</DialogTitle>

      <DialogContent>
        {isLoading && (
          <LinearProgress variant='indeterminate' sx={{ width: 1 }} />
        )}

        {errorText && (
          <Alert severity='error' sx={{ width: 1, mb: 1 }}>
            {errorText}
          </Alert>
        )}

        {!hasPoint && bidStatus?.status !== 'ACCEPT' && (
          <Alert severity='warning' sx={{ width: 1, mb: 1 }}>
            You need permission from seller in order to bid this product
          </Alert>
        )}

        <BidForm setLoading={setLoading} setErrorText={setErrorText} />
        {/*<AutoBidForm setLoading={setLoading} setErrorText={setErrorText} />*/}

        <Grid container>
          {latestAuction?.buyoutPrice && (
            <BorderButton color='success' fullWidth sx={{ mt: 2 }}>
              💵 DEAL: Buy the product instantly with{' '}
              {formatNumberToVND(latestAuction?.buyoutPrice || 0)}
            </BorderButton>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>

        <Button
          type='submit'
          form={`bid-form-${dialogName}`}
          disabled={isLoading}
        >
          Place bid
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BidDialog
