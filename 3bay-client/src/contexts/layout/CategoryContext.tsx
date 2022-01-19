import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import {
  CategoryAction,
  categoryReducer,
  CategoryState,
  initialCategoryState,
} from '../../stores/layout/category.store'
import Category from '../../models/category'
import axiosApiInstance from '../../services/api'
import useSocketContext, { SocketEvent } from '../socket/SocketContext'

type CategoryProviderProps = {
  children: ReactNode
}

type CategoryContextType = {
  state: CategoryState
  dispatch: Dispatch<CategoryAction>
  addAllCategories: (categories: Array<Category>) => void
}

const CategoryContext = createContext<CategoryContextType>({
  state: initialCategoryState,
  dispatch: () => null,
  addAllCategories(): never {
    throw new Error('Forgot to wrap component in `CategoryProvider`')
  },
})

export const useCategoryContext = (): CategoryContextType => {
  return useContext(CategoryContext)
}

export const CategoryProvider = ({
  children,
}: CategoryProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(categoryReducer, initialCategoryState)
  const { socket } = useSocketContext()

  const addAllCategories = useCallback(
    (categories: Array<Category>) => {
      //console.log(categories)
      dispatch({ type: 'ADD_ALL', payload: categories })
    },
    [dispatch],
  )

  useEffect(() => {
    ;(async () => {
      try {
        const response = await axiosApiInstance.get(`api/category`)
        addAllCategories(response.data as Array<Category>)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [addAllCategories])

  useEffect(() => {
    if (socket) {
      socket?.on(SocketEvent.CATEGORY_UPDATE, (data: Category[]) => {
        dispatch({
          type: 'ADD_ALL',
          payload: data,
        })
      })
    }
    return () => {
      if (socket) {
        socket?.off(SocketEvent.AUCTION_NOTIFY)
      }
    }
  }, [socket])

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      addAllCategories,
    }),
    [addAllCategories, state],
  )

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  )
}
