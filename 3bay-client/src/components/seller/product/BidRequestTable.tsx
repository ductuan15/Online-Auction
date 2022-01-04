import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Grid, Typography } from '@mui/material'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import { BidRequest } from '../../../models/bidder'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SellerService from '../../../services/seller.service'
import _ from 'lodash'

// type BidRequestTableProps = {
//   sx?: SxProps
// }

// TODO: handle realtime in this table
export default function BidRequestTable() {
  const [rows, setRows] = useState<BidRequest[]>([])
  const { state } = useProductContext()
  // const { user } = useAuth()

  const init = useCallback(async () => {
    if (state.currentProduct?.latestAuctionId) {
      try {
        const data = await SellerService.getBidRequests(
          state.currentProduct?.latestAuctionId,
        )
        setRows(data)
      } catch (e) {
        setRows([])
      }
    }
  }, [state.currentProduct?.latestAuctionId])

  useEffect(() => {
    ;(async () => {
      await init()
    })()
  }, [init])

  const rejectBidder = useCallback(
    async (params: GridRowParams) => {
      try {
        const idx = _.findIndex(rows, (row) => {
          return row.id === params.id
        })
        if (idx === -1) {
          return
        }
        const response = await SellerService.rejectBid(
          state.currentProduct?.latestAuctionId,
          rows[idx].bidId,
        )
        if (response) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== params.id))
        }
      } catch (e) {
        //
      }
    },
    [rows, state.currentProduct?.latestAuctionId],
  )

  const acceptBidder = useCallback(
    async (params: GridRowParams) => {
      try {
        const idx = _.findIndex(rows, (row) => {
          return row.id === params.id
        })
        if (idx === -1) {
          return
        }
        const response = await SellerService.acceptBid(
          state.currentProduct?.latestAuctionId,
          rows[idx].bidId,
        )
        if (response) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== params.id))
        }
      } catch (e) {
        //
      }
    },
    [rows, state.currentProduct?.latestAuctionId],
  )

  const columns: GridColumns = useMemo(
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
            onClick={async () => {
              await rejectBidder(params)
            }}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<CheckIcon />}
            label='Accept'
            onClick={async () => {
              await acceptBidder(params)
            }}
          />,
        ],
      },
    ],
    [rejectBidder, acceptBidder],
  )

  return (
    <>
      <Grid container item xs={12} mx={3} flexDirection='column'>
        <Typography
          gutterBottom
          variant='h4'
          component='h5'
          color='text.primary'
        >
          Bidders request
        </Typography>

        <Typography variant='subtitle1' color='text.primary' gutterBottom>
          These bidders would like to bid your product, you can accept/reject
          their request. <br />
          And remember that, once you reject their requests, they will not be
          able to bid your product.
        </Typography>

        <Grid item xs={12} md={6}>
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid columns={columns} rows={rows} />
          </div>
        </Grid>
      </Grid>
    </>
  )
}
