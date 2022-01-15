import '@fontsource/jetbrains-mono'
import AdminService from '../../../services/admin.service'
import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { useAuth } from '../../../contexts/user/AuthContext'
import { useAdminProductsContext } from '../../../contexts/admin/ProductsContext'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from '@mui/x-data-grid'
import CloseIcon from '@mui/icons-material/Close'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import { Avatar } from '@mui/material'
import Product from '../../../models/product'

type ProductsTableProps = {
  onLoadingData?: () => void
  onDataLoaded?: () => void
  onError?: (e: unknown) => void
  isLoading: boolean
}

const ProductTable = ({
  onLoadingData,
  onDataLoaded,
  onError,
  isLoading,
}: ProductsTableProps): JSX.Element => {
  const { state, dispatch } = useAdminProductsContext()

  const { user: authData } = useAuth()

  const loadData = useCallback(async () => {
    try {
      onLoadingData && onLoadingData()
      const productResponse = await AdminService.getProductList(
        state.productsTable.page,
        state.productsTable.limit,
      )
      dispatch({ type: 'ADD_ALL', payload: productResponse })
      // console.log(productResponse)
      onDataLoaded && onDataLoaded()
    } catch (e) {
      onError && onError(e)
    }
  }, [
    dispatch,
    onDataLoaded,
    onError,
    onLoadingData,
    state.productsTable.limit,
    state.productsTable.page,
  ])

  useEffect(() => {
    ;(async () => await loadData())()
  }, [loadData])

  const onRowDelete = useCallback(
    async (params: GridRowParams<Product>) => {
      // console.log(params.row)
      if (confirm(`Do you really want to remove ${params.row.name}`)) {
        try {
          onLoadingData && onLoadingData()

          await AdminService.removeProduct(params.row)
          await loadData()

          onDataLoaded && onDataLoaded()
        } catch (e) {
          onError && onError(e)
        }
      }
    },
    [loadData, onDataLoaded, onError, onLoadingData],
  )

  const columns: GridColumns = useMemo(
    () => [
      {
        width: 50,
        field: 'id',
        type: 'number',
        headerName: 'ID',
      },
      {
        field: 'thumbnail',
        type: 'string',
        width: 50,
        headerName: ' ',
        valueGetter: (params) => {
          if (params.row.thumbnails && params.row.thumbnails['sm']) {
            return params.row.thumbnails['sm']
          }
          return ''
        },
        renderCell: (params) => {
          return (
            <Avatar sx={{ width: 50 }} src={params.value} variant='rounded' />
          )
        },
      },
      {
        field: 'name',
        type: 'string',
        flex: 1,
        headerName: 'Name',
      },
      {
        field: 'seller2',
        headerName: 'Avatar',
        type: 'string',
        valueGetter: (params) => {
          if (params.row.seller) {
            return params.row.seller.name
          }
          return 'Tuan Cuong'
        },
        renderCell: (params) => {
          return <BackgroundLetterAvatars name={params.value} sx={{ mx: 2 }} />
        },
      },
      {
        field: 'seller',
        headerName: 'Seller',
        type: 'string',
        // flex: 0.5,
        minWidth: 250,
        valueGetter: (params) => {
          if (params.row.seller) {
            return params.row.seller.name
          }
          return 'Unknown'
        },
      },
      {
        field: 'createdAt',
        type: 'dateTime',
        headerName: 'Created At',
        minWidth: 200,
        valueGetter: ({ row }) => row.createdAt && new Date(row.createdAt),
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key={params.id}
            label='View product'
            icon={<LaunchOutlinedIcon />}
            onClick={() => {
              window.open(`/product/${params.row.id}`)
            }}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<CloseIcon />}
            label='Remove'
            disabled={!authData || params.row.seller.uuid === authData.user}
            onClick={async () => {
              await onRowDelete(params as GridRowParams<Product>)
            }}
          />,
        ],
      },
    ],
    [authData, onRowDelete],
  )

  return (
    <DataGrid
      columns={columns}
      rows={state.products}
      page={state.productsTable.page - 1}
      pageSize={state.productsTable.limit}
      rowCount={state.productsTable.total}
      loading={isLoading}
      paginationMode='server'
      rowsPerPageOptions={[5, 10, 25, 50]}
      onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page + 1 })}
      onPageSizeChange={(pageSize) =>
        dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize })
      }
      autoHeight
    />
  )
}

export default ProductTable
