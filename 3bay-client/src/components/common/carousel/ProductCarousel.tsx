import { useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import './ProductCarousel.css'
import { Container, Divider, useMediaQuery } from '@mui/material'
import Typography from '@mui/material/Typography'
import Product from '../../../models/product'
import { useEffectOnce } from '../../../hooks'
import { useTheme } from '@mui/material/styles'
import ProductItem from '../product-list/ProductItem'
import ProductItemSkeleton from '../product-list/ProductItemSkeleton'
import Dots from './Dots'

type CarouselProps = {
  name: string
  fetchFunction: () => Promise<Product[]>
  showLoading?: boolean
}

const responsive = {
  xl: {
    breakpoint: { min: 1536, max: 4000 },
    items: 4,
  },
  lg: {
    breakpoint: { min: 1201, max: 1535 },
    items: 4,
  },
  md: {
    breakpoint: { min: 901, max: 1200 },
    items: 3,
  },
  sm: {
    breakpoint: { min: 600, max: 899 },
    items: 2,
  },
  xs: {
    breakpoint: { min: 0, max: 599 },
    items: 1,
  },
}

const ProductCarousel = ({
  name,
  fetchFunction,
  showLoading,
}: CarouselProps): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  useEffectOnce(() => {
    ;(async () => {
      setLoading(true)
      // setTimeout(async () => {
      const response = await fetchFunction()
      setProducts(response)
      setLoading(false)
      // }, 1000)
      // console.log(response.data)
    })()
  })

  return (
    <Container sx={{ py: 2 }} disableGutters>
      <Divider>
        <Typography
          pt={2}
          gutterBottom
          variant='h4'
          component='h3'
          color='text.primary'
          align='center'
          fontWeight={500}
          sx={{
            textTransform: 'uppercase',
          }}
        >
          {name}
        </Typography>
      </Divider>

      <Carousel
        renderButtonGroupOutside
        draggable={false}
        showDots
        responsive={responsive} //Numbers of slides to show at each breakpoint
        infinite
        // autoPlay
        autoPlaySpeed={3000}
        customTransition='transform 300ms ease-in-out'
        transitionDuration={300}
        containerClass='container-with-dots'
        itemClass='carousel-item-padding-x-10-px'
        removeArrowOnDeviceType={['xs', 'sm', 'md']}
        dotListClass='custom-dot-container'
        customDot={<Dots theme={theme} nItems={products.length} />}
      >
        {isLoading && showLoading
          ? [1, 2, 3, 4, 5].map((key) => {
              return (
                <ProductItemSkeleton
                  key={key}
                  cardStyle={isMobile ? 'row' : 'card'}
                />
              )
            })
          : products.map((product) => {
              return (
                <ProductItem
                  key={product.id}
                  product={product}
                  cardStyle={isMobile ? 'row' : 'card'}
                />
              )
            })}
      </Carousel>
    </Container>
  )
}

export default ProductCarousel
