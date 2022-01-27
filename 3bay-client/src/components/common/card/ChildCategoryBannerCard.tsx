import Category from '../../../models/category'
import { Card, CardActionArea, Link, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import * as React from 'react'
import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { SxProps } from '@mui/system'

type ChildCategoryBannerCardProps = {
  category: Category
}

const cardStyle: SxProps = {
  position: 'relative',
  borderRadius: 0,
  height: 350,
}

const cardActionArea: SxProps = {
  position: 'relative',
  height: 1,
  width: 1,
}

const cardMedia: SxProps = {
  height: 1,
  overflow: 'hidden',
  position: 'relative',
}

const cardTypography: SxProps = {
  textOverflow: 'ellipsis',
  position: 'absolute',
  bottom: 0,
  p: 2,
  opacity: 0.6,
  width: 1,
  transition: `300ms`,
  cursor: 'pointer',
  bgcolor: 'black',
  [`&.hover`]: {
    opacity: 0.8,
  },
}

const ChildCategoryBannerCard = ({
  category,
}: ChildCategoryBannerCardProps): JSX.Element => {
  const categoryLink = useMemo(() => {
    return `/products/search/?key=&categoryId=${category.id}&sortBy=closeTime&sortType=desc&page=1`
  }, [category.id])

  return (
    <Card sx={cardStyle}>
      <Link
        color='inherit'
        underline='none'
        component={RouterLink}
        to={categoryLink}
        style={{ cursor: 'context-menu' }}
      >
        <CardActionArea sx={cardActionArea}>
          <CardMedia
            image={category.thumbnails.lg}
            title={category.title}
            sx={cardMedia}
          >
            <Typography sx={cardTypography} color='white' variant='h6'>
              {category.title}
            </Typography>
          </CardMedia>
        </CardActionArea>
      </Link>
    </Card>
  )
}

export default ChildCategoryBannerCard
