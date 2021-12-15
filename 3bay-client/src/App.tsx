import React from 'react'
import ThemeConfig from './theme'
import Home from "./pages/user/Home";

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <Home/>
    </ThemeConfig>
  )
}

export default App
