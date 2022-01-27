import * as React from 'react'
import { useCallback, useState } from 'react'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Box, CardActionArea } from '@mui/material'
import Category from '../../../models/category'
import { SxProps } from '@mui/system'

type Props = {
  category: Category
}

const cardContainer: SxProps = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '100%',
  width: '100%',
  bgcolor: 'rgba(0, 0, 0, 0.54)',
  color: 'white',
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
}

const cardTypography: SxProps = {
  position: 'absolute',
  top: '50%',
  width: '100%',
  transform: 'translateY(-50%)',
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
}

export default function CategoryCard(prop: Props): JSX.Element {
  const [elevation, setElevation] = useState(0)

  const onMouseOver = useCallback(() => setElevation(24), [])
  const onMouseOut = useCallback(() => setElevation(0), [])

  return (
    <Card
      elevation={elevation}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      sx={{ borderRadius: 4 }}
    >
      <CardActionArea>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            height='240'
            component='img'
            image={prop.category.thumbnails.original}
            alt={prop.category.title}
          />
          <Box sx={cardContainer}>
            <Typography
              sx={cardTypography}
              textAlign={'center'}
              variant='h6'
              component='div'
            >
              {prop.category.title}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  )
}
