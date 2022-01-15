import * as React from 'react'
import { useMemo, useState } from 'react'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import { Grid, Slider, TextField, Typography } from '@mui/material'
import NumberFormat from 'react-number-format'

const dialogName = 'dialog-set-bid-price'

type AutoBidFormProps = {
  setLoading: (value: boolean) => void
  setErrorText: (value: string | null) => void
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

function BidFormProps({
  setLoading,
  setErrorText,
}: AutoBidFormProps): JSX.Element | null {
  const {
    state: { latestAuction },
  } = useProductContext()

  const initialPrice = useMemo(() => {
    if (latestAuction?.currentPrice && latestAuction?.incrementPrice) {
      return +latestAuction?.currentPrice + +latestAuction?.incrementPrice
    }
    return 0
  }, [latestAuction?.currentPrice, latestAuction?.incrementPrice])

  const [value, setValue] = useState<number | string | Array<number | string>>(
    initialPrice,
  )

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(+newValue)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleBlur = () => {
    if (latestAuction?.currentPrice && latestAuction?.buyoutPrice) {
      if (value < initialPrice) {
        setValue(initialPrice)
      } else if (value > latestAuction.buyoutPrice) {
        setValue(latestAuction.buyoutPrice)
      }
    }
  }

  return latestAuction ? (
    <Grid
      id={`auto-bid-form-${dialogName}`}
      container
      component='form'
      direction='column'
    >
      <Typography color='text.primary' variant='h6'>
        Automatic bidding
      </Typography>

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

export default BidFormProps
