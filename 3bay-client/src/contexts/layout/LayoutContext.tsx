import * as React from 'react'
import {
  createContext,
  Dispatch,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import LayoutReducer, {
  LayoutActionType,
  LayoutState,
  initialLayoutState,
} from '../../stores/layout/layout.store'

type LayoutContextProps = {
  children: ReactNode
}

type LayoutContextType = {
  state: LayoutState
  dispatch: Dispatch<LayoutActionType>
  toggleDrawer: (
    open: boolean,
  ) => (event: KeyboardEvent | MouseEvent | SyntheticEvent) => void
}

const layoutInitialValue: LayoutContextType = {
  state: initialLayoutState,
  dispatch: () => null,
  toggleDrawer: (): never => {
    throw new Error('Forgot to wrap component in `AppBarCtxProvider`')
  },
}

export const LayoutContext =
  createContext<LayoutContextType>(layoutInitialValue)

export const useLayoutContext = (): LayoutContextType => {
  return useContext(LayoutContext)
}

export const LayoutCtxProvider = ({
  children,
}: LayoutContextProps): JSX.Element => {
  const [state, dispatch] = useReducer(LayoutReducer, initialLayoutState)
  const toggleDrawer = useCallback(
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
    },
    [dispatch],
  )

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      toggleDrawer,
    }),
    [state, toggleDrawer],
  )

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  )
}
