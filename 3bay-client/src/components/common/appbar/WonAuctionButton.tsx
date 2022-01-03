import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@mui/material'
import { useUserContext } from '../../../contexts/user/UserContext'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';

const JoiningAuctionButton = (): JSX.Element => {
  const navigate = useNavigate()
  const {
    state: { wonauctionlist },
  } = useUserContext()
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
          <Badge badgeContent={wonauctionlist.length} color='secondary'>
            <InventoryOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default JoiningAuctionButton