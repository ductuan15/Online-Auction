import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {useNavigate} from "react-router-dom";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const WatchListButton = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Tooltip title='Watch list'>
          <IconButton
            onClick={() =>
              navigate("/user/watchlist")
            }
            size='large'
            edge='end'
            aria-label='Watch list'
            color='inherit'
          >
            <FavoriteBorderOutlinedIcon/>
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}

export default WatchListButton
