import {Slide, useScrollTrigger} from '@mui/material'
import * as React from 'react'

interface Props {
  children: React.ReactElement
}

export function HideOnScroll({ children }: Props): JSX.Element {
  const trigger = useScrollTrigger({
    target: window,
  })

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  )
}