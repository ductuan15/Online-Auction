import MaterialTable, {
  Action,
  Column,
  MaterialTableProps,
  Query,
  QueryResult,
} from '@material-table/core'
import { Typography } from '@mui/material'
import '@fontsource/jetbrains-mono'
import AdminService from '../../../services/admin.service'
import { createRef, useCallback, useMemo } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useAuth } from '../../../contexts/user/AuthContext'
import Product from '../../../data/product'
import { useAdminProductsContext } from '../../../contexts/admin/ProductsContext'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import moment from 'moment/moment'

type ProductsTableProps = {
  onLoadingData?: () => void
  onDataLoaded?: () => void
  onError?: (e: unknown) => void
}

const columns: Column<Product>[] = [
  {
    title: 'ID',
    field: 'id',
    editable: 'never',
    type: 'numeric',
  },
  {
    title: 'Name',
    field: 'name',
    editable: 'never',
    resizable: true,
    cellStyle: {
      width: `500px`,
    },
  },
  {
    title: 'Date created',
    field: 'createdAt',
    editable: 'onAdd',
    render: (data) => {
      return moment(data.createdAt).format('L')
    },
  },
  {
    title: 'Seller',
    field: 'seller.name',
    render: (data) => {
      return <BackgroundLetterAvatars name={data.seller.name} />
    },
    sorting: false,
    editable: 'never',
  },
  {
    title: 'Seller name',
    field: 'seller.name',
    editable: 'never',
  },
]

const detailPanel = ({ rowData }: { rowData: Product }) => {
  return (
    <Typography
      variant='body1'
      fontFamily='Jetbrains Mono'
      mx={2}
      p={1}
      color='text.main'
      aria-multiline='true'
      sx={{
        whiteSpace: 'pre',
      }}
    >
      {JSON.stringify(rowData, null, 2)}
    </Typography>
  )
}

const ProductTable = ({
  onLoadingData,
  onDataLoaded,
  onError,
}: ProductsTableProps): JSX.Element => {
  const { state, dispatch } = useAdminProductsContext()
  const tableRef = createRef<MaterialTableProps<Product>>()

  const { user: authData } = useAuth()

  const actions = useMemo<Action<Product>[]>(
    () => [
      {
        icon: () => <RefreshIcon />,
        tooltip: 'Refresh Data',
        isFreeAction: true,
        onClick: () =>
          tableRef.current &&
          tableRef.current.onQueryChange &&
          tableRef.current?.onQueryChange(),
      },
    ],
    [tableRef],
  )

  const onRowDelete = useCallback(
    (oldData: Product) => {
      return new Promise((resolve, reject) => {
        ;(async () => {
          try {
            onLoadingData && onLoadingData()

            await AdminService.removeProduct(oldData)

            resolve({
              data: state.products,
              page: state.productsTable.page - 1,
              totalCount: state.productsTable.total,
            })
            onDataLoaded && onDataLoaded()
          } catch (e) {
            onError && onError(e)
            reject(e)
          }
        })()
      })
    },
    [
      onDataLoaded,
      onError,
      onLoadingData,
      state.products,
      state.productsTable.page,
      state.productsTable.total,
    ],
  )

  const editable = useMemo<MaterialTableProps<Product>['editable']>(() => {
    return {
      isDeletable: (rowData) => {
        return !!authData && rowData.seller.uuid !== authData.user
      },
      onRowDelete: onRowDelete,
    }
  }, [authData, onRowDelete])

  const fetchData = useCallback(
    (query: Query<Product>): Promise<QueryResult<Product>> => {
      return new Promise((resolve, reject) => {
        ;(async () => {
          try {
            onLoadingData && onLoadingData()
            const productResponse = await AdminService.getProductList(
              query.page + 1,
              query.pageSize,
            )
            dispatch({ type: 'ADD_ALL', payload: productResponse })
            resolve({
              data: productResponse.products,
              page: productResponse.page - 1,
              totalCount: productResponse.total,
            })
            onDataLoaded && onDataLoaded()
          } catch (e) {
            onError && onError(e)
            reject(e)
          }
        })()
      })
    },
    [dispatch, onDataLoaded, onError, onLoadingData],
  )

  return (
    <MaterialTable
      title={'Products'}
      tableRef={tableRef}
      columns={columns}
      data={fetchData}
      detailPanel={detailPanel}
      actions={actions}
      editable={editable}
      options={{
        columnResizable: true,
        tableLayout: 'auto',
      }}
    />
  )
}

export default ProductTable
