import React from 'react'
import ThemeConfig from './theme'
import SignUp from './pages/user/auth/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/user/auth/SignIn'
import Error404 from './pages/common/Error404'
import Home from './pages/common/Home'
import { AuthProvider } from './contexts/user/AuthContext'
import CategoryManagement from './pages/admin/CategoryManagement'
import HomeLayout from './components/layout/HomeLayout'
import SignInLayout from './components/layout/SignInLayout'
import ForgotPassword from './pages/user/auth/ForgotPassword'
import VerifyAccount from './pages/user/auth/VerifyAccount'
import Product from './pages/common/productDetail/Product'
import RequireAdminRole from './components/user/auth/RequireAdminRole'
import ProductList from './pages/common/productList/productList'
import UserLayout from './components/layout/user/UserLayout'
import Account from './pages/user/profile/Account'
import Password from './pages/user/profile/Password'
import Profile from './pages/user/profile/Profile'
import RequireLogin from './components/user/auth/RequireLogin'
import ChangeEmail from './pages/user/auth/ChangeEmail'
import ScrollToTop from './components/layout/ScrollToTop'
import { UserProvider } from './contexts/user/UserContext'

function GlobalRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path='/' element={<HomeLayout />}>
          <Route index element={<Home />} />

          <Route element={<RequireAdminRole />}>
            <Route path='cat' element={<CategoryManagement />} />
          </Route>

          <Route path='product/:id' element={<Product />} />
          <Route path='products/' element={<ProductList />} />

          <Route element={<RequireLogin />}>
            <Route path='user/view' element={<Profile />} />

            <Route path='user/' element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path='account' element={<Account />} />
              <Route path='password' element={<Password />} />
              <Route path='*' />
            </Route>
          </Route>

          <Route element={<RequireAdminRole />}>
            <Route path='cat' element={<CategoryManagement />} />
          </Route>

          <Route path='*' element={<Error404 />} />
        </Route>

        <Route element={<SignInLayout />}>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/forgot' element={<ForgotPassword />} />
          <Route path='/verify/:id' element={<VerifyAccount />} />

          <Route element={<RequireLogin />}>
            <Route path='/change-email' element={<ChangeEmail />} />
          </Route>
        </Route>

        <Route element={<SignInLayout maxWidth='sm' />}>
          <Route path='/signup' element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <AuthProvider>
        <UserProvider>
          <GlobalRouter />
        </UserProvider>
      </AuthProvider>
    </ThemeConfig>
  )
}

export default App
