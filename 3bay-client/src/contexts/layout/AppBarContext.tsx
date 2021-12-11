import * as React from 'react'
import { createContext, FC, ReactNode, useContext } from 'react'

type AppBarContextProps = {
  children: ReactNode
}

type AppBarContextType = {
  anchorEl: null | HTMLElement
  mobileMoreAnchorEl: null | HTMLElement
  notifyAnchorEl: null | HTMLElement
  isMenuOpened: boolean
  isMobileMenuOpened: boolean
  isNotifyMenuOpened: boolean
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  handleMobileMenuClose: () => void
  handleNotifyMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  handleNotifyMenuClose: () => void
  handleMenuClose: () => void
  menuId: string
  mobileMenuId: string
  notifyMenuId: string
}

const appBarInitialValue: AppBarContextType = {
  anchorEl: null,
  mobileMoreAnchorEl: null,
  notifyAnchorEl: null,
  isMenuOpened: false,
  isMobileMenuOpened: false,
  isNotifyMenuOpened: false,
  handleProfileMenuOpen: () => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
  handleMobileMenuOpen: () => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
  handleMobileMenuClose: () => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
  handleMenuClose: () => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
  handleNotifyMenuClose: () => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
  handleNotifyMenuOpen: () => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
  menuId: '',
  mobileMenuId: '',
  notifyMenuId: '',
}

export const AppBarContext =
  createContext<AppBarContextType>(appBarInitialValue)

export const useAppBarContext: () => AppBarContextType = () =>
  useContext(AppBarContext)

export const AppBarCtxProvider: FC<AppBarContextProps> = ({ children }) => {
  const [profileAnchorEl, setProfileAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const [notifyAnchorEl, setNotifyAnchorEl] =
    React.useState<null | HTMLElement>(null)

  const isMenuOpened = Boolean(profileAnchorEl)
  const isMobileMenuOpened = Boolean(mobileMoreAnchorEl)
  const isNotifyMenuOpened = Boolean(notifyAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setProfileAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const handleNotifyMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifyAnchorEl(event.currentTarget)
  }

  const handleNotifyMenuClose = () => {
    setNotifyAnchorEl(null)
  }

  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'
  const notifyMenuId = 'primary-search-account-menu-Notify'

  return (
    <AppBarContext.Provider
      value={{
        anchorEl: profileAnchorEl,
        mobileMoreAnchorEl,
        notifyAnchorEl,
        isMenuOpened,
        isMobileMenuOpened,
        isNotifyMenuOpened,
        handleProfileMenuOpen,
        handleMobileMenuOpen,
        handleMobileMenuClose,
        handleMenuClose,
        handleNotifyMenuOpen,
        handleNotifyMenuClose,
        menuId,
        mobileMenuId,
        notifyMenuId,
      }}
    >
      {children}
    </AppBarContext.Provider>
  )
}
