import { Box, Divider, Grid, Typography } from '@mui/material'
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
import * as React from 'react'
import { useEffect, useState } from 'react'
import { StarOutlineOutlined } from '@mui/icons-material'
import BorderButton from '../../../components/common/button/BorderButton'

type ProfileInfoRowProps = {
  icon: JSX.Element
  text: string
}

const ProfileInfoRow = ({ icon, text }: ProfileInfoRowProps): JSX.Element => {
  return (
    <Grid item container direction='row' spacing={2}>
      <Grid item>{icon}</Grid>
      <Grid item>
        <Typography color='text.primary'>{text}</Typography>
      </Grid>
    </Grid>
  )
}

const Profile = (): JSX.Element => {
  useTitle('3bay | My profile')
  const {
    state: { userDetails: user },
  } = useUserContext()

  const [userPoint, setUserPoint] = useState<number | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      if (user?.uuid) {
        const point = await UserService.getPoint(user?.uuid)
        setUserPoint(point ? point * 100 : undefined) // percent
      } else {
        setUserPoint(undefined)
      }
    })()
  }, [user?.uuid])

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

          <RouterLink
            to={'/user/account'}
            style={{
              textDecoration: 'none',
            }}
          >
            <BorderButton sx={{ mb: 1 }}>
              <EditOutlinedIcon sx={{ mr: 1 }} />
              Edit profile
            </BorderButton>
          </RouterLink>
        </Grid>

        <Grid item my={2}>
          <Divider />
        </Grid>

        <ProfileInfoRow
          icon={<EmailOutlinedIcon sx={{ color: 'text.primary' }} />}
          text={user?.email || ''}
        />
        <ProfileInfoRow
          icon={<CakeOutlinedIcon sx={{ color: 'text.primary' }} />}
          text={user?.dob ? moment(new Date(user?.dob)).utc().format('L') : ''}
        />

        <ProfileInfoRow
          icon={<HomeOutlinedIcon sx={{ color: 'text.primary' }} />}
          text={user?.address || ''}
        />

        <ProfileInfoRow
          icon={<StarOutlineOutlined sx={{ color: 'text.primary' }} />}
          text={
            userPoint !== undefined ? `(${userPoint}% approval)` : `(No rating)`
          }
        />
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
