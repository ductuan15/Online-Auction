import * as React from 'react'

export type LayoutState = {
  anchorEl: undefined | HTMLElement
  mobileMoreAnchorEl: undefined | HTMLElement
  notifyAnchorEl: undefined | HTMLElement
  // isMenuOpened: boolean
  // isMobileMenuOpened: boolean
  // isNotifyMenuOpened: boolean
  // isSnackbarOpened: boolean
  menuId: string
  mobileMenuId: string
  notifyMenuId: string
  openDrawer: boolean
  listLayout: 'row' | 'card'
  shouldLoadingSearchResult: boolean
}

export type LayoutActionType =
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
  | { type: 'CHANGE_LIST_LAYOUT'; payload: 'card' | 'row' }
  | { type: 'LOAD_SEARCH_RESULT' }
  | { type: 'DONE_LOADING_SEARCH_RESULTS' }

export const initialLayoutState: LayoutState = {
  anchorEl: undefined,
  mobileMoreAnchorEl: undefined,
  notifyAnchorEl: undefined,
  // isMenuOpened: false,
  // isMobileMenuOpened: false,
  // isNotifyMenuOpened: false,
  // isSnackbarOpened: false,
  menuId: '',
  mobileMenuId: '',
  notifyMenuId: '',
  openDrawer: false,
  listLayout: 'card',
  shouldLoadingSearchResult: false,
}

const LayoutReducer = (
  state: LayoutState,
  action: LayoutActionType,
): LayoutState => {
  switch (action.type) {
    case 'OPEN_PROFILE_MENU':
      return { ...state, anchorEl: action.payload.currentTarget }

    case 'OPEN_MOBILE_MENU':
      return { ...state, mobileMoreAnchorEl: action.payload.currentTarget }

    case 'OPEN_NOTIFY_MENU':
      return {
        ...state,
        notifyAnchorEl: action.payload.currentTarget,
      }
    case 'CLOSE_MOBILE_MENU':
      return { ...state, mobileMoreAnchorEl: undefined }

    case 'CLOSE_PROFILE_MENU':
      return { ...state, anchorEl: undefined, mobileMoreAnchorEl: undefined }

    case 'CLOSE_NOTIFY_MENU':
      return { ...state, notifyAnchorEl: undefined }

    case 'TOGGLE_DRAWER':
      return { ...state, openDrawer: action.payload }

    case 'CHANGE_LIST_LAYOUT':
      return { ...state, listLayout: action.payload }

    case 'LOAD_SEARCH_RESULT':
      return { ...state, shouldLoadingSearchResult: true }

    case 'DONE_LOADING_SEARCH_RESULTS':
      return { ...state, shouldLoadingSearchResult: false }

    default:
      return state
  }
}
export default LayoutReducer
