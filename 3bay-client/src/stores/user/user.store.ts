import { UpgradeToSellerRequest, UserDetails } from '../../models/user'

export type UserState = {
  userDetails?: UserDetails
}

export type UserAction =
  | { type: 'GET_ACCOUNT_INFO'; payload: UserDetails | undefined }
  | { type: 'UPGRADE_TO_SELLER_REQUEST'; payload: UpgradeToSellerRequest }

export const initialUserState = {
  //
}

export const userReducer = (
  state: UserState,
  action: UserAction,
): UserState => {
  switch (action.type) {
    case 'GET_ACCOUNT_INFO':
      return {
        ...state,
        userDetails: action.payload,
      }
    case 'UPGRADE_TO_SELLER_REQUEST': {
      let newData = state.userDetails
      if (state.userDetails) {
        newData = {
          ...state.userDetails,
          upgradeToSellerRequest: action.payload,
        }
      }
      return {
        ...state,
        userDetails: newData,
      }
    }
    default:
      return state
  }
}
