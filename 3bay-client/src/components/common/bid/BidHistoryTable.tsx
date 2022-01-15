import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Grid, Typography } from '@mui/material'
import BackgroundLetterAvatars from '../../user/profile/BackgroundLettersAvatar'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SellerService from '../../../services/seller.service'
import _ from 'lodash'
import { useAuth } from '../../../contexts/user/AuthContext'
import { Bid } from '../../../models/bids'
import { useIsAuctionClosed } from '../../../hooks/use-is-auction-closed'
import NumberFormat from 'react-number-format'
import { nameMasking } from '../../../utils/name-mask'

// type BidRequestTableProps = {
//   sx?: SxProps
// }

export default function BidHistoryTable() {
  const {
    state: { currentProduct, latestAuction },
  } = useProductContext()
  const { user } = useAuth()
  const [rows, setRows] = useState<Bid[]>(() => {
    if (latestAuction?.bids) {
      return latestAuction?.bids
    }
    return []
  })
  const isAuctionClosed = useIsAuctionClosed(latestAuction)

  useEffect(() => {
    if (latestAuction?.bids) {
      // console.log(latestAuction?.bids)
      setRows(latestAuction?.bids)
    } else {
      setRows([])
    }
  }, [latestAuction?.bids])

  const isProductSeller = useMemo(() => {
    if (user && currentProduct?.sellerId) {
      return user?.user === currentProduct.sellerId
    }
    return false
  }, [currentProduct, user])

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
          latestAuction?.id,
          rows[idx].id,
        )
        if (response) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== params.id))
        }
      } catch (e) {
        //
      }
    },
    [latestAuction?.id, rows],
  )

  const columns: GridColumns = useMemo(
    () => [
      {
        field: 'bidTime',
        type: 'dateTime',
        headerName: 'Bid time',
        flex: 2,
        valueGetter: ({ row }) => row.bidTime && new Date(row.bidTime),
      },
      {
        field: 'bidder',
        type: 'string',
        headerName: 'Name',
        flex: 2,
        valueGetter: (params) => {
          if (params.row.bidder) {
            return params.row.bidder.name
          }
          return 'Unknown'
        },
        renderCell: (params: GridRenderCellParams<string>) => (
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            width={1}
          >
            <Typography>
              {nameMasking(params.value)}
              {latestAuction?.winningBid?.bidderId === params.row.bidder.uuid
                ? ' 👑'
                : ''}
            </Typography>

            <BackgroundLetterAvatars name={params.value} sx={{ mx: 2 }} />
          </Box>
        ),
      },
      {
        field: 'bidPrice',
        type: 'number',
        headerName: 'Amount',
        flex: 1,
        renderCell: (params: GridRenderCellParams<string>) => (
          <NumberFormat
            thousandSeparator
            displayType={'text'}
            value={params.value}
            prefix='₫'
          />
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
            sx={{
              display: !isProductSeller || isAuctionClosed ? 'none' : undefined,
            }}
            onClick={async () => {
              await rejectBidder(params)
            }}
          />,
        ],
      },
    ],
    [
      isAuctionClosed,
      isProductSeller,
      latestAuction?.winningBid?.bidderId,
      rejectBidder,
    ],
  )

  return (
    <>
      <Grid container item xs={12} flexDirection='column'>
        <Typography
          gutterBottom
          variant='h4'
          component='h5'
          color='text.primary'
        >
          Bids
        </Typography>

        <Grid item xs={12} md={'auto'}>
          <DataGrid columns={columns} rows={rows} autoHeight />
        </Grid>
      </Grid>
    </>
  )
}
