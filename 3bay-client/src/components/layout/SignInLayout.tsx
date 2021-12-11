import React, { FC } from 'react'
import StyledDiv from '../common/StyledDiv'
import { Container } from '@mui/material'
import {Copyright} from '../Copyright'

interface Props {
  children: React.ReactNode
}

const SignInLayout: FC<Props> = ({ children }) => {
  return (
    <StyledDiv>
      <Container component='main' maxWidth='xs'>
        {children}
        <Copyright sx={{mt: 8, mb: 4}}/>
      </Container>
    </StyledDiv>
  )
}

export default SignInLayout
