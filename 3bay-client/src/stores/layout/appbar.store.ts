import * as React from 'react'

export type AppbarState = {
  anchorEl: null | HTMLElement
  mobileMoreAnchorEl: null | HTMLElement
  notifyAnchorEl: null | HTMLElement
  isMenuOpened: boolean
  isMobileMenuOpened: boolean
  isNotifyMenuOpened: boolean
  menuId: string
  mobileMenuId: string
  notifyMenuId: string
  notifyBadgeContent: number
  openDrawer: boolean
}

export type AppBarActionType =
  | {
      type: 'OPEN_PROFILE_MENU'
      payload: React.MouseEvent<HTMLElement>
    }
  | { type: 'OPEN_MOBILE_MENU'; payload: React.MouseEvent<HTMLElement> }
  | { type: 'OPEN_NOTIFY_MENU'; payload: React.MouseEvent<HTMLElement> }
  | { type: 'CLOSE_PROFILE_MENU' }
  | { type: 'CLOSE_MOBILE_MENU' }
  | { type: 'CLOSE_NOTIFY_MENU' }
  | { type: 'TOGGLE_DRAWER'; payload: boolean }
  | { type: 'NOTIFY_BADGE_CONTENT'; payload: number }

export const initialAppBarState = {
  anchorEl: null,
  mobileMoreAnchorEl: null,
  notifyAnchorEl: null,
  isMenuOpened: false,
  isMobileMenuOpened: false,
  isNotifyMenuOpened: false,
  menuId: '',
  mobileMenuId: '',
  notifyMenuId: '',
  notifyBadgeContent: 2,
  openDrawer: false,
}

const AppbarReducer = (
  state: AppbarState,
  action: AppBarActionType,
): AppbarState => {
  switch (action.type) {
    case 'OPEN_PROFILE_MENU':
      return { ...state, anchorEl: action.payload.currentTarget }

    case 'OPEN_MOBILE_MENU':
      return { ...state, mobileMoreAnchorEl: action.payload.currentTarget }

    case 'OPEN_NOTIFY_MENU':
      return {
        ...state,
        notifyAnchorEl: action.payload.currentTarget,
        notifyBadgeContent: 0,
      }
    case 'CLOSE_MOBILE_MENU':
      return { ...state, mobileMoreAnchorEl: null }

    case 'CLOSE_PROFILE_MENU':
      return { ...state, anchorEl: null, mobileMoreAnchorEl: null }

    case 'CLOSE_NOTIFY_MENU':
      return { ...state, notifyAnchorEl: null }

    case 'TOGGLE_DRAWER':
      return { ...state, openDrawer: action.payload }

    default:
      return state
  }
}
export default AppbarReducer
