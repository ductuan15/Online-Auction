import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import BackgroundLetterAvatars from '../../../components/user/profile/BackgroundLettersAvatar'
import { useUserContext } from '../../../contexts/user/UserContext'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import moment from 'moment'
import RoleLabel from '../../../components/user/profile/RoleLabel'
import { Link as RouterLink } from 'react-router-dom'
import useTitle from '../../../hooks/use-title'
import sellerService from '../../../services/seller.service'
import UserService from '../../../services/user.service'
import ProductShortList from '../../../components/common/product-list/ProductShortList'

const Profile = (): JSX.Element => {
  useTitle('3bay | My profile')
  const {
    state: { userDetails: user },
  } = useUserContext()

  return (
    <Grid container mt={2} mb={2}>
      <Grid
        md={3}
        sx={{ display: { xs: 'none', md: 'flex' } }}
        item
        container
        direction='row'
        alignItems='center'
        justifyContent='center'
      >
        <BackgroundLetterAvatars
          name={user?.name || ''}
          fontSize='80px'
          sx={{
            width: `180px`,
            height: `180px`,
          }}
        />
      </Grid>

      <Grid item container xs={12} md={9} direction='column' spacing={1}>
        <Grid item container direction='row' alignItems='flex-end'>
          <Typography
            component='h2'
            variant='h3'
            fontWeight={600}
            color='text.primary'
            mr={1}
          >
            {user?.name || ''}
          </Typography>

          <RoleLabel sx={{ mb: 1 }} />

          <Box flexGrow={1} />

          <Button
            startIcon={<EditOutlinedIcon />}
            variant='contained'
            component={RouterLink}
            to={'/user/account'}
            sx={{ mb: 1 }}
          >
            Edit profile
          </Button>
        </Grid>

        <Grid item my={2}>
          <Divider />
        </Grid>

        <Grid item container direction='row' spacing={2}>
          <Grid item>
            <EmailOutlinedIcon color='action' />
          </Grid>
          <Grid item>
            <Typography color='text.secondary'>{user?.email || ''}</Typography>
          </Grid>
        </Grid>

        <Grid item container direction='row' spacing={2}>
          <Grid item>
            <CakeOutlinedIcon color='action' />
          </Grid>
          <Grid item>
            <Typography color='text.secondary'>
              {user?.dob ? moment(new Date(user?.dob)).utc().format('L') : ''}
            </Typography>
          </Grid>
        </Grid>

        <Grid item container direction='row' spacing={2}>
          <Grid item>
            <HomeOutlinedIcon color='action' />
          </Grid>
          <Grid item>
            <Typography color='text.secondary'>
              {user?.address || ''}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ mt: 2 }} />
      </Grid>

      {user?.role === 'SELLER' && (
        <Grid
          item
          container
          xs={12}
          mt={2}
          flexDirection={'row'}
          columnSpacing={2}
        >
          <ProductShortList
            title='Posted product list'
            productService={sellerService.getAllPostedProduct}
            detailPage='/seller/posted-product-list'
          />

          <ProductShortList
            title='Auctions have winner'
            productService={sellerService.getAllAuctionHasWinner}
            detailPage='/seller/auctions-have-winner'
          />
        </Grid>
      )}

      <Grid
        item
        container
        xs={12}
        mt={2}
        flexDirection={'row'}
        columnSpacing={2}
      >
        <ProductShortList
          title='Auction list'
          productService={UserService.getUserAuctionList}
          detailPage='/user/auction-list'
        />

        <ProductShortList
          title='Won auction list'
          productService={UserService.getUserWonAuctionList}
          detailPage='/user/won-auction-list'
        />
      </Grid>
    </Grid>
  )
}

export default Profile
