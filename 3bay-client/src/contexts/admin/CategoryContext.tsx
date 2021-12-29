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
} from '../../stores/admin/category.store'
import Category from '../../models/category'
import axiosApiInstance from '../../services/api'

type CategoryProviderProps = {
  children: ReactNode
}

type CategoryContextType = {
  state: CategoryState
  dispatch: Dispatch<CategoryAction>
  addAllCategories: (categories: Array<Category>) => void
  addCategory: (category: Category) => void
  removeCategory: (category: Category) => void
  updateCategory: (current: Category, updated: Category) => void
}

const CategoryContext = createContext<CategoryContextType>({
  state: initialCategoryState,
  dispatch: () => null,
  addAllCategories(): never {
    throw new Error('Forgot to wrap component in `CategoryProvider`')
  },
  addCategory(): never {
    throw new Error('Forgot to wrap component in `CategoryProvider`')
  },
  removeCategory(): never {
    throw new Error('Forgot to wrap component in `CategoryProvider`')
  },
  updateCategory(): never {
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

  const addAllCategories = useCallback(
    (categories: Array<Category>) => {
      //console.log(categories)
      dispatch({ type: 'ADD_ALL', payload: categories })
    },
    [dispatch],
  )

  const addCategory = useCallback(
    (category: Category) => {
      dispatch({ type: 'ADD', payload: category })
    },
    [dispatch],
  )

  const removeCategory = useCallback(
    (category: Category) => {
      dispatch({ type: 'REMOVE', payload: category })
    },
    [dispatch],
  )

  const updateCategory = useCallback(
    (current: Category, updated: Category) => {
      dispatch({ type: 'UPDATE', payload: { current, updated } })
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

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      addAllCategories,
      addCategory,
      removeCategory,
      updateCategory,
    }),
    [addAllCategories, addCategory, removeCategory, state, updateCategory],
  )

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  )
}
