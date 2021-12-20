import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  CategoryAction,
  categoryReducer,
  CategoryState,
  initialCategoryState,
} from '../../stores/admin/category.store'
import Category from '../../data/category'

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

  const addAllCategories = (categories: Array<Category>) => {
    //console.log(categories)
    dispatch({ type: 'ADD_ALL', payload: categories })
  }
  const addCategory = (category: Category) => {
    dispatch({ type: 'ADD', payload: category })
  }
  const removeCategory = (category: Category) => {
    dispatch({ type: 'REMOVE', payload: category })
  }
  const updateCategory = (current: Category, updated: Category) => {
    dispatch({ type: 'UPDATE', payload: { current, updated } })
  }

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      addAllCategories,
      addCategory,
      removeCategory,
      updateCategory,
    }),
    [state, dispatch],
  )

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  )
}
