export type AuthState = {
  isAuth: boolean
  user?: {
    id: string
    token: string
    refreshToken: string
    role: 'BIDDER' | 'SELLER' | 'ADMINISTRATOR'
  }
}

export type AuthAction = { type: 'SIGN_OUT' }

export const initialAuthState = {
  isAuth: false,
}

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    default:
      return state
  }
}
