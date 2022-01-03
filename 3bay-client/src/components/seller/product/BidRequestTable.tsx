import * as React from 'react'
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRenderCellParams,
  GridRowId,
} from '@mui/x-data-grid'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Typography } from '@mui/material'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import { useAuth } from '../../../contexts/user/AuthContext'
import { BidRequest } from '../../../models/bidder'
import {useEffect} from 'react'
import SellerService from '../../../services/seller.service'

// type BidRequestTableProps = {
//   sx?: SxProps
// }

export default function BidRequestTable() {
  const [rows, setRows] = React.useState<BidRequest[]>([])
  const { state, dispatch } = useProductContext()
  const { user } = useAuth()

  useEffect(() => {
    ;(async () => {
      if (state.currentProduct?.latestAuctionId) {
        try {
          const data = await SellerService.getBidRequests(state.currentProduct?.latestAuctionId)
          setRows(data)
        } catch (e) {
          setRows([])
        }
      }
    })()
  }, [state.currentProduct?.latestAuctionId])

  const rejectBidder = React.useCallback(
    (id: GridRowId) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id))
      })
    },
    [],
  )

  const acceptBidder = React.useCallback(
    (id: GridRowId) => () => {
      // setRows((prevRows) =>
      //   // prevRows.map((row) =>
      //   //   row.id === id ? { ...row,  } : row,
      //   // ),
      // )
    },
    [],
  )

  const duplicateUser = React.useCallback(
    (id: GridRowId) => () => {
      // setRows((prevRows) => {
      //   const rowToDuplicate = prevRows.find((row) => row.id === id)!
      //   return [...prevRows, { ...rowToDuplicate, id: Date.now() }]
      // })
    },
    [],
  )

  const columns: GridColumns = React.useMemo(
    () => [
      {
        field: 'name',
        type: 'string',
        headerName: 'Name',
        flex: 1,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            width={1}
          >
            <Typography>{params.value}</Typography>

            <BackgroundLetterAvatars name={params.value} sx={{ mx: 2 }} />
          </Box>
        ),
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key={params.id}
            icon={<CloseIcon />}
            label='Deny'
            onClick={rejectBidder(params.id)}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<CheckIcon />}
            label='Accept'
            onClick={acceptBidder(params.id)}
          />,
        ],
      },
    ],
    [rejectBidder, acceptBidder],
  )

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  )
}
