import React from 'react'
import StyledDiv from '../common/StyledDiv'
import { Container } from '@mui/material'
import { Copyright } from '../Copyright'

interface Props {
  children: React.ReactNode
  maxWidth?: 'xl' | 'md' | 'sm' | 'xs' | 'lg' | false
}

const SignInLayout = ({ children, maxWidth }: Props): JSX.Element => {
  return (
    <StyledDiv>
      <Container component='main' maxWidth={maxWidth ? maxWidth : 'xs'}>
        {children}
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </StyledDiv>
  )
}

export default SignInLayout
