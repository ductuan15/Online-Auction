import React from 'react'
import ThemeConfig from './theme'
import SignUp from './pages/user/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/user/SignIn'
import Error404 from './pages/common/Error404'
import Home from './pages/common/Home'
import { AuthProvider } from './contexts/user/AuthContext'
import RequireAuth from './components/user/auth/RequireAuth'
import { CategoryManagement } from './pages/admin/CategoryManagement'
import HomeLayout from './components/layout/HomeLayout'
import SignInLayout from './components/layout/SignInLayout'
import ForgotPassword from './pages/user/ForgotPassword'

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route
                path='/cat'
                element={
                  <RequireAuth>
                    <CategoryManagement />
                  </RequireAuth>
                }
              />
              <Route path='*' element={<Error404 />} />
            </Route>

            <Route element={<SignInLayout />}>
              <Route path='/signin' element={<SignIn />} />
              <Route path='/forgot' element={<ForgotPassword />} />
            </Route>

            <Route element={<SignInLayout maxWidth='sm' />}>
              <Route path='/signup' element={<SignUp />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeConfig>
  )
}

export default App
