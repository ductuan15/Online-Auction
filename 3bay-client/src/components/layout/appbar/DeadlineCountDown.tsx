import * as React from 'react'
import { FC, useEffect, useState } from 'react'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/system'

type Props = {
  date: string
  sx?: SxProps
}

// leading zeros
const zeroPad = (num: number, places: number) => {
  return String(num).padStart(places, '0')
}

const zp2 = (num: number) => zeroPad(num, 2)

const DeadlineCountDown: FC<Props> = ({ date, sx }) => {
  const [countDownText, setCountDownText] = useState('')

  const endDate = new Date(date)

  const _second = 1000
  const _minute = _second * 60
  const _hour = _minute * 60
  const _day = _hour * 24

  let timer: NodeJS.Timeout

  const showRemaining = () => {
    const now = new Date()
    const distance = endDate.getTime() - now.getTime()

    if (distance < 0) {
      if (timer) {
        clearInterval(timer)
      }
      setCountDownText('NOW')
      return
    }
    const days = Math.floor(distance / _day)
    const hours = Math.floor((distance % _day) / _hour)
    const minutes = Math.floor((distance % _hour) / _minute)
    const seconds = Math.floor((distance % _minute) / _second)

    setCountDownText(
      `${zp2(days)}d:${zp2(hours)}h:${zp2(minutes)}m:${zp2(seconds)}s`,
    )
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
