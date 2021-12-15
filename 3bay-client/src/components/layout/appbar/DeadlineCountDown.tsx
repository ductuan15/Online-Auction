import * as React from 'react'
import { useEffect, useState } from 'react'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/system'
import moment from 'moment'

type Props = {
  date: string
  sx?: SxProps
}

const DeadlineCountDown = ({ date, sx }: Props): JSX.Element => {
  const [countDownText, setCountDownText] = useState('')

  const endDate = moment(date)

  let timer: NodeJS.Timeout

  const showRemaining = () => {
    const now = moment()
    const distance = endDate.date() - now.date()

    if (distance < 0) {
      if (timer) {
        clearInterval(timer)
      }
      setCountDownText('NOW')
      return
    }

    setCountDownText(now.to(endDate))
  }

  useEffect(() => {
    showRemaining()
    timer = setInterval(showRemaining, 1000)
  }, [])

  return (
    <Box sx={sx}>
      <AccessTimeOutlinedIcon color='error' sx={{ mr: 1 }} />
      <Typography>Countdown: {countDownText} </Typography>
    </Box>
  )
}

export default DeadlineCountDown
