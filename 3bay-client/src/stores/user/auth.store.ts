export type AuthState = {
  isAuth: boolean
  id: string
  token: string
}

export type AuthAction =
  | { type: 'SIGN_OUT' }
  | {
      type: 'SIGN_IN'
      payload: {
        id: string
        token: string
      }
    }

export const initialAuthState = {
  isAuth: false,
  id: '',
  token: '',
}

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        isAuth: true,
        id: action.payload.id,
        token: action.payload.token,
      }

    case 'SIGN_OUT':
      return { ...state, isAuth: false, id: '', token: '' }

    default:
      return state
  }
}
