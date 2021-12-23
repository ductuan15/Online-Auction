import {createContext, Dispatch, ReactNode, useContext, useMemo, useReducer} from 'react'
import {
  initialUsersState,
  UsersAction, usersReducer,
  UsersState,
} from '../../stores/admin/users.store'

type UsersProviderProps = {
  children: ReactNode
}

type UsersContextType = {
  state: UsersState
  dispatch: Dispatch<UsersAction>
}

const usersContextInitialState: UsersContextType = {
  state: initialUsersState,
  dispatch: () => null,
}

const AdminUsersContext = createContext<UsersContextType>(usersContextInitialState)

export const useAdminUsersContext = (): UsersContextType => {
  return useContext(AdminUsersContext)
}

export const AdminUsersProvider = ({ children }: UsersProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(usersReducer, initialUsersState)

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  )

  return (
    <AdminUsersContext.Provider value={contextValue}>{children}</AdminUsersContext.Provider>
  )
}


