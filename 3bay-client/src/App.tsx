import React from 'react'
import ThemeConfig from './theme'
import SignUp from './pages/user/auth/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/user/auth/SignIn'
import Error404 from './pages/common/error/Error404'
import Home from './pages/common/Home'
import { AuthProvider } from './contexts/user/AuthContext'
import CategoryManagement from './pages/admin/CategoryManagement'
import HomeLayout from './components/common/layout/HomeLayout'
import SignInLayout from './components/common/layout/SignInLayout'
import ForgotPassword from './pages/user/auth/ForgotPassword'
import VerifyAccount from './pages/user/auth/VerifyAccount'
import RequireRole from './components/user/auth/RequireRole'
import UserLayout from './components/common/layout/UserLayout'
import Account from './pages/user/profile/Account'
import Password from './pages/user/profile/Password'
import Profile from './pages/user/profile/Profile'
import RequireLogin from './components/user/auth/RequireLogin'
import ProductDetails from './pages/common/product-details/ProductDetails'
import ChangeEmail from './pages/user/auth/ChangeEmail'
import ScrollToTop from './components/common/layout/ScrollToTop'
import { UserProvider } from './contexts/user/UserContext'
import UsersManagement from './pages/admin/UsersManagement'
import { AdminUsersProvider } from './contexts/admin/UsersContext'
import SearchPage from './pages/common/search/SearchPage'
import { AdminProductsProvider } from './contexts/admin/ProductsContext'
import ProductsManagement from './pages/admin/ProductsManagement'
import WatchList from './pages/user/watchlist/WatchList'
import CreateProduct from './pages/seller/CreateProduct'
import EditProduct from './pages/seller/EditProduct'
import ProductProvider from './contexts/product/ProductDetailsContext'
import PostedProductList from './pages/seller/PostedProductList'
import { SocketProvider } from './contexts/socket/SocketContext'
import AuctionList from "./pages/user/auctionlist/AuctionList";
import WonAuctionList from "./pages/user/wonauctionlist/WonAuctionList";

function GlobalRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path='/' element={<HomeLayout />}>
          <Route index element={<Home />} />

          <Route path='product/create' element={<RequireRole role={'SELLER'}/>}>
            <Route index element={<CreateProduct/>}/>
          </Route>

          <Route
            path='product/:id'
            element={
              <ProductProvider>
                <ProductDetails />
              </ProductProvider>
            }
          />

          <Route path='product/:id/edit' element={<EditProduct />} />
          <Route path='products/search' element={<SearchPage />} />

          <Route element={<RequireLogin />}>
            <Route path='user/view' element={<Profile />} />
            <Route path='user/watchlist' element={<WatchList />} />
            <Route path='user/auctionlist' element={<AuctionList />} />
            <Route path='user/wonauctionlist' element={<WonAuctionList />} />
            <Route
              path='user/postedproductlist'
              element={<PostedProductList />}
            />

            <Route path='user/' element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path='account' element={<Account />} />
              <Route path='password' element={<Password />} />
              <Route path='*' />
            </Route>
          </Route>

          <Route path='admin/' element={<RequireRole role='ADMINISTRATOR' />}>
            <Route path='cat' element={<CategoryManagement />} />
            <Route
              path='users'
              element={
                <AdminUsersProvider>
                  <UsersManagement />
                </AdminUsersProvider>
              }
            />
            <Route
              path='products'
              element={
                <AdminProductsProvider>
                  <ProductsManagement />
                </AdminProductsProvider>
              }
            />
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
    <AuthProvider>
      <SocketProvider>
        <UserProvider>
          <ThemeConfig>
            <GlobalRouter />
          </ThemeConfig>
        </UserProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
