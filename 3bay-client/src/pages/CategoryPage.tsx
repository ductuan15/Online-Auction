import * as React from 'react'
import { useEffect, useState } from 'react'
import Category from '../data/category'
import { Grid } from '@mui/material'
import CategoryCard from '../components/CategoryCard'
import config from '../config/config'

export const CategoryPage = (): JSX.Element => {
  const [categories, setCategories] = useState<Array<Category>>(() => [])

  useEffect(() => {
    fetch(`${config.apiHostName}/api/category/`)
      .then((r) => {
        return r.json() as Promise<Array<Category>>
      })
      .then((data) => {
        console.log(data)
        if (data) {
          const categories = data.map((obj) => {
            return new Category(obj)
          })
          setCategories(categories)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Grid container marginTop={2} marginBottom={4} spacing={4} justifyContent="between">
      {categories.map((category) => (
        <Grid item xs={6} md={4} lg={3} key={category.title}>
          <CategoryCard category={category} />
        </Grid>
      ))}
    </Grid>
  )
}
