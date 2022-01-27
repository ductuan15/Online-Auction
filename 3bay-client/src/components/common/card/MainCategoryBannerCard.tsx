import Category from '../../../models/category'
import { Box, Card, Link, Typography } from '@mui/material'
import BorderButton from '../button/BorderButton'
import CardMedia from '@mui/material/CardMedia'
import * as React from 'react'
import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { SxProps } from '@mui/system'

type CategoryBannerCardProps = {
  category: Category
}

const cardStyle: SxProps = {
  position: 'relative',
  borderRadius: 0,
  height: 350,
}

const cardContainer: SxProps = {
  color: 'white',
  height: 1,
  position: 'relative',
  cursor: 'pointer',
  transition: '300ms',
  p: 0,
}

const cardMedia: SxProps = {
  height: 1,
  width: 1,
  overflow: 'hidden',
  p: 0,
  m: 0,
}

const cardContent: SxProps = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '100%',
  width: '100%',
  bgcolor: 'rgba(0, 0, 0, 0.48)',
  color: 'white',
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
}

const MainCategoryBannerCard = ({
  category,
}: CategoryBannerCardProps): JSX.Element => {
  const categoryLink = useMemo(() => {
    return `/products/search/?key=&categoryId=${category.id}&sortBy=closeTime&sortType=desc&page=1`
  }, [category.id])

  return (
    <Card sx={cardStyle}>
      <Box sx={cardContainer}>
        <CardMedia
          sx={cardMedia}
          component='img'
          image={category.thumbnails.md}
          alt={category.title}
        />

        <Box sx={cardContent}>
          <Box
            width={1}
            height={1}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
          >
            <Typography variant='h4'>{category.title}</Typography>

            <BorderButton
              sx={{ mt: 1, width: 'auto' }}
              unSelectedColour='white'
              unSelectedBorderColour='white'
              color='inherit'
            >
              <Link
                underline='none'
                color='inherit'
                component={RouterLink}
                to={categoryLink}
                style={{ cursor: 'context-menu' }}
              >
                View Now
              </Link>
            </BorderButton>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default MainCategoryBannerCard
