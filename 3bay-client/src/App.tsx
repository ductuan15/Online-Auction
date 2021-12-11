import React from 'react'
import ThemeConfig from './theme'
import SignIn from './pages/common/SignIn'

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <SignIn />
    </ThemeConfig>
  )
}

export default App
