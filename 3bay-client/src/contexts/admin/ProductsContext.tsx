import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  initialProductsState,
  ProductsAction,
  productsReducer,
  ProductsState,
} from '../../stores/admin/products.store'

type ProductsProviderProps = {
  children: ReactNode
}

type ProductsContextType = {
  state: ProductsState
  dispatch: Dispatch<ProductsAction>
}

const productsContextInitialState: ProductsContextType = {
  state: initialProductsState,
  dispatch: () => null,
}

const AdminProductsContext = createContext<ProductsContextType>(
  productsContextInitialState,
)

export const useAdminProductsContext = (): ProductsContextType => {
  return useContext(AdminProductsContext)
}

export const AdminProductsProvider = ({
  children,
}: ProductsProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(productsReducer, initialProductsState)

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  )

  return (
    <AdminProductsContext.Provider value={contextValue}>
      {children}
    </AdminProductsContext.Provider>
  )
}


