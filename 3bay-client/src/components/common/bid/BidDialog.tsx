import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import BidForm from './BidForm'

const dialogName = 'dialog-set-bid-price'

function BidDialog(): JSX.Element {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const {
    state: { isBidDialogOpened },
    dispatch,
  } = useProductContext()

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
        <BidForm
          isLoading={isLoading}
          setLoading={setLoading}
          errorText={errorText}
          setErrorText={setErrorText}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        {/*{hasPoint && (*/}
        <Button
          type='submit'
          form={`bid-form-${dialogName}`}
          disabled={isLoading}
        >
          Place bid
        </Button>
        {/*)}*/}
      </DialogActions>
    </Dialog>
  )
}

export default BidDialog
