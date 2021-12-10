import * as React from 'react'
import { createContext, FC, ReactNode, useContext } from 'react'

type AppBarContextProps = {
  children: ReactNode
}

type AppBarContextType = {
  anchorEl: null | HTMLElement
  mobileMoreAnchorEl: null | HTMLElement
  isMenuOpened: boolean
  isMobileMenuOpened: boolean
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  handleMobileMenuClose: () => void
  handleMenuClose: () => void
  menuId: string
  mobileMenuId: string
}

const appBarInitialValue: AppBarContextType = {
  anchorEl: null,
  mobileMoreAnchorEl: null,
  isMenuOpened: false,
  isMobileMenuOpened: false,
  handleProfileMenuOpen: () => {
    throw new Error('Forgot to use wrap component in `AppBarCtxProvider`')
  },
  handleMobileMenuOpen: () => {
    throw new Error('Forgot to use wrap component in `AppBarCtxProvider`')
  },
  handleMobileMenuClose: () => {
    throw new Error('Forgot to use wrap component in `AppBarCtxProvider`')
  },
  handleMenuClose: () => {
    throw new Error('Forgot to use wrap component in `AppBarCtxProvider`')
  },
  menuId: '',
  mobileMenuId: ''
}

export const AppBarContext =
  createContext<AppBarContextType>(appBarInitialValue)

export const useAppBarContext: () => AppBarContextType = () => useContext(AppBarContext)

export const AppBarCtxProvider: FC<AppBarContextProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)

  const isMenuOpened = Boolean(anchorEl)
  const isMobileMenuOpened = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'

  return (
    <AppBarContext.Provider
      value={{
        anchorEl,
        mobileMoreAnchorEl,
        isMenuOpened,
        isMobileMenuOpened,
        handleProfileMenuOpen,
        handleMobileMenuOpen,
        handleMobileMenuClose,
        handleMenuClose,
        menuId,
        mobileMenuId,
      }}
    >
      {children}
    </AppBarContext.Provider>
  )
}
