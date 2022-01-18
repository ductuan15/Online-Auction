import { SyntheticEvent } from 'react'
import { UserDetails } from '../../../models/user'
import {
  Box,
  CardHeader,
  IconButton,
  Stack,
  Typography,
  TypographyStyle,
} from '@mui/material'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'

const titleStyle: TypographyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const titleSx: SxProps<Theme> = (theme) => ({
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: 'normal',
  '&:hover': {
    color: theme.palette.primary.dark,
  },
})

const ProductHeaderRow = ({
  name,
  color,
  xsScreen,
  toggleWatchlistButton,
  userDetails,
  isInWatchlist,
}: {
  name: string
  color: string
  xsScreen: boolean
  toggleWatchlistButton: (e: SyntheticEvent) => void
  userDetails?: UserDetails
  isInWatchlist: boolean
}): JSX.Element => {
  return (
    <CardHeader
      title={
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Typography
            variant={xsScreen ? 'body1' : 'h6'}
            style={titleStyle}
            color={color}
            sx={titleSx}
          >
            {name || ' '}
          </Typography>
          {userDetails && (
            <Box>
              <IconButton
                aria-label='add to watchlist'
                color='inherit'
                size='small'
                onClick={toggleWatchlistButton}
              >
                {isInWatchlist ? (
                  <FavoriteOutlinedIcon />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </IconButton>
            </Box>
          )}
        </Stack>
      }
      sx={
        xsScreen
          ? { pb: 0, pt: 0.75, px: 0.75 }
          : {
              pb: 0,
              pt: 2,
              px: 2,
            }
      }
    />
  )
}

export default ProductHeaderRow