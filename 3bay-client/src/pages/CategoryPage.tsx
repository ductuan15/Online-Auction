import * as React from 'react'
import { useEffect, useState } from 'react'
import Category from '../data/category'
import { Grid } from '@mui/material'
import CategoryCard from '../components/CategoryCard'

type Props = {
  // categories: Array<Category>
}

export const CategoryPage = (props: Props) => {
  let [categories, setCategories] = useState(() => [])

  useEffect(() => {
    fetch(`http://localhost:3030/api/category/`)
      .then((r) => {
        return r.json()
      })
      .then((data) => {
        console.log(data)
        if (data) {
          const categories = data.map((obj: Object) => {
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
    <Grid container marginTop={2} spacing={4} justifyContent="between">
      {categories.map((category: any) => (
        <Grid item xs={6} md={4} lg={3} key={category.title}>
          <CategoryCard category={category} />
        </Grid>
      ))}
    </Grid>
  )
}
