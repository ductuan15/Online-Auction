import React from 'react'
import ThemeConfig from './theme'
import SignUp from './pages/user/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/user/SignIn'
import Error404 from './pages/common/Error404'
import Home from './pages/common/Home'

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </ThemeConfig>
  )
}

export default App
