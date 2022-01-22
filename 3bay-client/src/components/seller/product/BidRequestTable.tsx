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
import { nameMasking } from '../../../utils/name-mask'
import moment from 'moment'

// type BidRequestTableProps = {
//   sx?: SxProps
// }

export default function BidRequestTable() {
  const [rows, setRows] = useState<BidRequest[]>([])
  const { state } = useProductContext()
  // const { user } = useAuth()

  const init = useCallback(async () => {
    if (state.latestAuction?.id) {
      try {
        if (moment(state.latestAuction?.closeTime).isAfter()) {
          const data = await SellerService.getBidRequests(
            state.latestAuction?.id,
          )
          setRows(data)
        }
      } catch (e) {
        setRows([])
      }
    }
  }, [state.latestAuction])

  useEffect(() => {
    ;(async () => {
      await init()
    })()
  }, [init])

  const processBidRequest = useCallback(
    async (params: GridRowParams<BidRequest>, acceptRequest: boolean) => {
      try {
        const requestFunction = acceptRequest
          ? SellerService.acceptBid
          : SellerService.rejectBid

        const response = await requestFunction(
          state.latestAuction?.id,
          params.row.bidId,
          params.row.id,
        )

        if (response) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== params.id))
        }
      } catch (e) {
        //
      }
    },
    [state.latestAuction?.id],
  )

  const rejectBidder = useCallback(
    async (params: GridRowParams<BidRequest>) => {
      if (
        confirm(
          `Are you sure you want to ban ${nameMasking(
            params.row.name,
          )} from bidding your product?\n` +
            `Your decision cannot be reversed!`,
        )
      ) {
        await processBidRequest(params, false)
      }
    },
    [processBidRequest],
  )

  const acceptBidder = useCallback(
    async (params: GridRowParams<BidRequest>) =>
      processBidRequest(params, true),
    [processBidRequest],
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
            <Typography>{nameMasking(params.value)}</Typography>

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
              await rejectBidder(params as GridRowParams<BidRequest>)
            }}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<CheckIcon />}
            label='Accept'
            onClick={async () => {
              await acceptBidder(params as GridRowParams<BidRequest>)
            }}
          />,
        ],
      },
    ],
    [rejectBidder, acceptBidder],
  )

  return (
    <>
      <Grid
        container
        item
        xs={12}
        flexDirection='column'
        display={rows.length === 0 ? 'none' : undefined}
      >
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

        <Grid item xs={12} md={'auto'}>
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid columns={columns} rows={rows} />
          </div>
        </Grid>
      </Grid>
    </>
  )
}
