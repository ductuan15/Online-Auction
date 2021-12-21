import * as React from 'react'
import {
  createContext,
  Dispatch,
  ReactNode,
  SyntheticEvent,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import AppbarReducer, {
  AppBarActionType,
  AppbarState,
  initialAppBarState,
} from '../../stores/layout/appbar.store'

type AppBarContextProps = {
  children: ReactNode
}

type AppBarContextType = {
  state: AppbarState
  dispatch: Dispatch<AppBarActionType>
  toggleDrawer: (
    open: boolean,
  ) => (event: KeyboardEvent | MouseEvent | SyntheticEvent) => void
}

const appBarInitialValue: AppBarContextType = {
  state: initialAppBarState,
  dispatch: () => null,
  toggleDrawer: (): never => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
}

export const AppBarContext =
  createContext<AppBarContextType>(appBarInitialValue)

export const useAppBarContext = (): AppBarContextType => {
  return useContext(AppBarContext)
}

export const AppBarCtxProvider = ({
  children,
}: AppBarContextProps): JSX.Element => {
  const [state, dispatch] = useReducer(AppbarReducer, initialAppBarState)
  const toggleDrawer =
    (open: boolean) => (event: KeyboardEvent | MouseEvent | SyntheticEvent) => {
      //console.log(event)
      if (
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
      ) {
        //console.log('return called')
        return
      }
      dispatch({ type: 'TOGGLE_DRAWER', payload: open })
    }

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      toggleDrawer,
    }),
    [state, dispatch],
  )

  return (
    <AppBarContext.Provider value={contextValue}>
      {children}
    </AppBarContext.Provider>
  )
}
