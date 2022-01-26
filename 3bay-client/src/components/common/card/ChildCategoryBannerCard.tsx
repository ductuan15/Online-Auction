import Category from '../../../models/category'
import { Card, CardActionArea, Link, Typography } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import * as React from 'react'
import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'

type ChildCategoryBannerCardProps = {
  category: Category
}

const ChildCategoryBannerCard = ({
  category,
}: ChildCategoryBannerCardProps): JSX.Element => {
  const categoryLink = useMemo(() => {
    return `/products/search/?key=&categoryId=${category.id}&sortBy=closeTime&sortType=desc&page=1`
  }, [category.id])

  return (
    <Card sx={{ position: 'relative', borderRadius: 0, height: 350 }}>
      <Link
        color='inherit'
        underline='none'
        component={RouterLink}
        to={categoryLink}
        style={{ cursor: 'context-menu' }}
      >
        <CardActionArea sx={{ position: 'relative', height: 1, width: 1 }}>
          <CardMedia
            image={category.thumbnails.lg}
            title={category.title}
            sx={{
              height: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Typography
              sx={{
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
              }}
              color='white'
              variant='h6'
            >
              {category.title}
            </Typography>
          </CardMedia>
        </CardActionArea>
      </Link>
    </Card>
  )
}

export default ChildCategoryBannerCard
