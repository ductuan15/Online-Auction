import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea } from '@mui/material'
import { SxProps } from '@mui/system'

type ProductCardProps = {
  sx?: SxProps
  imageHeight?: string
  product: {
    name: string
  }
}

const ProductCard = ({ sx, product }: ProductCardProps): JSX.Element => {
  return (
    <Card sx={sx}>
      <CardActionArea>
        <CardMedia
          component='img'
          image='https://source.unsplash.com/random'
          alt='lorem ipsum'
          height={'128'}
        />
      </CardActionArea>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {product.name}
        </Typography>
        <Button>Hello</Button>
      </CardContent>
    </Card>
  )
}

export default ProductCard
