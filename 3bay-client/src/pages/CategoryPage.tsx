import * as React from 'react'
import { useEffect, useState } from 'react'
import Category from '../data/category'
import { Grid } from '@mui/material'
import CategoryCard from '../components/CategoryCard'
import config from '../config/config'

type Props = {
  // categories: Array<Category>
}

export const CategoryPage = (props: Props) => {
  const [categories, setCategories] = useState(() => [])

  useEffect(() => {
    fetch(`${config.apiHostName}/api/category/`)
      .then((r) => {
        return r.json()
      })
      .then((data) => {
        console.log(data)
        if (data) {
          const categories = data.map((obj: any) => {
            return new Category(obj)
          })
          setCategories(categories)
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])

  return (
    <Grid
      container
      marginTop={2}
      marginBottom={4}
      spacing={4}
      justifyContent="between"
    >
      {categories.map((category: any) => (
        <Grid item xs={6} md={4} lg={3} key={category.title}>
          <CategoryCard category={category} />
        </Grid>
      ))}
    </Grid>
  )
}
