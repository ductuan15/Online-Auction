import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'
import UserService from "../../../services/user.service";

const JoiningAuctionButton = (): JSX.Element => {
  const navigate = useNavigate()
  // const wonAuctionList = await UserService.getUserWonAuctionList()
  // dispatch({
  //   type: 'UPDATE_AUCTION_LIST',
  //   payload: wonAuctionList,
  // })

  return (
    <Box>
      <Tooltip title='Won Auctions list'>
        <IconButton
          onClick={() => navigate('/user/wonauctionlist')}
          size='large'
          edge='end'
          aria-label='Won Auctions'
          color='inherit'
        >
          <InventoryOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default JoiningAuctionButton
