import * as React from 'react'
import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'
import Category from '../data/category'

interface Props {
  category: Category
}

export default function CategoryCard(prop: Props) {
  const [elevation, setElevation] = useState(1)

  const onMouseOver = () => setElevation(8)
  const onMouseOut = () => setElevation(1)

  return (
    <Card
      elevation={elevation}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <CardActionArea>
        <CardMedia
          height="240"
          component="img"
          image={prop.category.thumbnails.original}
          alt={prop.category.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {prop.category.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}