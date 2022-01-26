import { Container } from '@mui/material'
import Carousel, { ResponsiveType } from 'react-multi-carousel'
import { useMemo } from 'react'
import { useCategoryContext } from '../../../contexts/layout/CategoryContext'
import MainCategoryBannerCard from '../card/MainCategoryBannerCard'
import ChildCategoryBannerCard from '../card/ChildCategoryBannerCard'

const responsive: ResponsiveType = {
  xl: {
    breakpoint: { min: 1536, max: 4000 },
    items: 3,
  },
  lg: {
    breakpoint: { min: 1201, max: 1535 },
    items: 3,
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

const CategoryCarousel = () => {
  const {
    state: { allCategories },
  } = useCategoryContext()

  const categoryItems = useMemo(() => {
    const categories = []
    for (const category of allCategories) {
      categories.push(category)
      if (category.otherCategories?.length) {
        categories.push(...category.otherCategories)
      }
    }
    return categories
  }, [allCategories])

  return (
    <Container sx={{ py: 2 }} disableGutters>
      <Carousel
        infinite
        responsive={responsive}
        autoPlay
        autoPlaySpeed={5000}
        customTransition='transform 300ms ease-in-out'
        transitionDuration={300}
      >
        {categoryItems.map((category) => {
          return category.otherCategories?.length ? (
            <MainCategoryBannerCard category={category} key={category.id} />
          ) : (
            <ChildCategoryBannerCard category={category} key={category.id} />
          )
        })}
      </Carousel>
    </Container>
  )
}

export default CategoryCarousel
