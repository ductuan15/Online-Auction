import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  categoryReducer,
  initialCategoryState,
} from '../../store/admin/category/reducers'
import { CategoryAction, CategoryState } from '../../store/admin/category/types'
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
  updateCategory: (category: Category) => void
}

const CategoryContext = createContext<CategoryContextType>({
  state: initialCategoryState,
  dispatch: () => null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  addAllCategories(_categories: Array<Category>) {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  addCategory(_category: Category) {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  removeCategory(_category: Category) {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  updateCategory(_category: Category) {},
})

export const useCategoryContext: () => CategoryContextType = () => {
  return useContext(CategoryContext)
}

export const CategoryProvider: FC<CategoryProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialCategoryState)

  const addAllCategories = (categories: Array<Category>) => {
    console.log(categories)
    dispatch({ type: 'ADD_ALL', payload: categories })
  }
  const addCategory = (category: Category) => {
    dispatch({ type: 'ADD', payload: category })
  }
  const removeCategory = (category: Category) => {
    dispatch({ type: 'REMOVE', payload: category })
  }
  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE', payload: category })
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
