import * as React from 'react'
import {useCallback, useEffect, useRef, useState} from 'react'
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

  const timer = useRef<NodeJS.Timeout>()

  const showRemaining = useCallback(() => {
    const now = moment()

    if (!endDate.isAfter(now)) {
      if (timer.current) {
        clearInterval(timer.current)
      }
      setCountDownText('NOW')
      return
    }

    setCountDownText(now.to(endDate))
  }, [endDate])

  useEffect(() => {
    showRemaining()
    timer.current = setInterval(showRemaining, 1000)
  }, [showRemaining])

  return (
    <Box sx={sx}>
      <AccessTimeOutlinedIcon color='error' sx={{ mr: 1 }} />
      <Typography>Countdown: {countDownText} </Typography>
    </Box>
  )
}

export default DeadlineCountDown
