import { UserDetails } from '../../data/user'

export type UserState = {
  userDetails?: UserDetails
}

export type UserAction = { type: 'GET_ACCOUNT_INFO'; payload: UserDetails }

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
    default:
      return state
  }
}
