import { useState } from 'react'
import ProductCard from '../product/ProductCard'
import Carousel, { DotProps } from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import './Carousel.css'
import { Container, Divider } from '@mui/material'
import Typography from '@mui/material/Typography'
import Product from '../../../models/product'
import { AxiosResponse } from 'axios'
import { useEffectOnce } from '../../../hooks'
import { Theme, useTheme } from '@mui/material/styles'
import { GREY } from '../../../theme/palette'

type CarouselProps = {
  name: string
  fetchFunction: () => Promise<AxiosResponse<Product[]>>
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

const CustomDots = ({
  index,
  active,
  onClick,
  carouselState,
  theme,
}: DotProps & { theme: Theme }) => {
  const totalItems = carouselState?.totalItems ?? 1
  const widthPercent = 100 / totalItems
  return (
    <button
      onClick={(e) => {
        onClick?.()
        e.preventDefault()
      }}
      style={{
        width: `${widthPercent}%`,
        marginLeft: index === 0 ? 0 : '4px',
        marginRight: index === totalItems - 1 ? 0 : '4px',
        backgroundColor: active
          ? `${theme.palette.primary.main}`
          : `${GREY[500_48]}`,
        border: 'none',
        outline: 'none',
        borderRadius: '8px',
        height: '6px',
      }}
    />
  )
}

const CarouselCard = (props: CarouselProps): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([])

  const theme = useTheme()

  useEffectOnce(() => {
    ;(async () => {
      const response = await props.fetchFunction()
      setProducts(response.data)
      // console.log(response.data)
    })()
  })

  return (
    <Container sx={{ pb: 2 }}>
      <Divider />
      <Typography
        pt={2}
        gutterBottom
        variant='h4'
        component='h5'
        color='text.primary'
        align='center'
      >
        {props.name}
      </Typography>

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
        itemClass='carousel-item-padding-20-px'
        removeArrowOnDeviceType={['sm', 'md']}
        customDot={<CustomDots theme={theme} />}
      >
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />
        })}
      </Carousel>
    </Container>
  )
}

export default CarouselCard
