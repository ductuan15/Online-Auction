import * as React from 'react'
import {FormEventHandler, useCallback, useMemo, useState} from 'react'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import { Grid, Slider, TextField, Typography } from '@mui/material'
import NumberFormat from 'react-number-format'
import { setErrorTextMsg } from '../../../utils/error'
import formatNumberToVND from '../../../utils/currency-format'
import AuctionService from '../../../services/auction.service'
import { useIsMounted } from '../../../hooks'

const dialogName = 'dialog-set-bid-price'

type AutoBidFormProps = {
  setLoading: (value: boolean) => void
  setErrorText: (value: string | null) => void
  onClose: () => void
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const NumberFormatCustom = React.forwardRef<NumberFormat<number>, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
        thousandSeparator
        isNumericString
        prefix='₫'
      />
    )
  },
)

function AutoBidForm({
  setLoading,
  setErrorText,
  onClose,
}: AutoBidFormProps): JSX.Element | null {
  const {
    state: { latestAuction },
  } = useProductContext()

  const isMounted = useIsMounted()

  const initialPrice = useMemo(() => {
    if (latestAuction?.currentPrice && latestAuction?.incrementPrice) {
      return +latestAuction?.currentPrice + +latestAuction?.incrementPrice
    }
    return 0
  }, [latestAuction?.currentPrice, latestAuction?.incrementPrice])

  const [value, setValue] = useState<number | string | Array<number | string>>(
    initialPrice,
  )

  const handleSliderChange = useCallback( (event: Event, newValue: number | number[]) => {
      setValue(+newValue)
    }
  , [])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value))
  }, [])

  const handleBlur = useCallback(() => {
    if (latestAuction?.currentPrice && latestAuction?.buyoutPrice) {
      if (value < initialPrice) {
        setValue(initialPrice)
      } else if (value > latestAuction.buyoutPrice) {
        setValue(latestAuction.buyoutPrice)
      }
    }
  }, [initialPrice, latestAuction?.buyoutPrice, latestAuction?.currentPrice, value])

  const handleSubmit: FormEventHandler = useCallback(async (event) => {
    event.preventDefault()

    if (isNaN(+value)) return

    if (!latestAuction) {
      setErrorTextMsg('Auction is not opened', setErrorText)
      return
    }
    const maximumPrice = +value
    if (
      confirm(
        `Are you sure you want to perform automatic bidding for this product with` +
        ` a maximum price of ${formatNumberToVND(maximumPrice)}?`,
      )
    ) {
      setLoading(true)

      try {
        await AuctionService.newAutoBid(latestAuction.id, maximumPrice)
        onClose()
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
  }, [isMounted, latestAuction, onClose, setErrorText, setLoading, value])

  return latestAuction ? (
    <Grid
      id={`auto-bid-form-${dialogName}`}
      container
      direction='column'
      component='form'
      onSubmit={handleSubmit}
    >
      <Typography color='text.primary' variant='subtitle1' fontWeight={600}>
        Maximum price
      </Typography>

      {latestAuction?.currentPrice && latestAuction?.buyoutPrice && (
        <Slider
          value={typeof value === 'number' ? value : initialPrice}
          onChange={handleSliderChange}
          aria-labelledby='input-slider'
          step={+latestAuction.incrementPrice}
          min={initialPrice}
          max={+latestAuction.buyoutPrice}
        />
      )}

      <TextField
        value={typeof value === 'number' ? value : latestAuction?.currentPrice}
        onChange={handleInputChange}
        onBlur={handleBlur}
        inputProps={{
          // step: latestAuction.incrementPrice,
          // min: initialPrice,
          // max: latestAuction.buyoutPrice,
          // type: 'number',
          'aria-labelledby': 'input-slider',
        }}
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: NumberFormatCustom as any,
        }}
      />
    </Grid>
  ) : null
}

export default AutoBidForm
