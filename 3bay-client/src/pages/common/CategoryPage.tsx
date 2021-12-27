import * as React from 'react'
import { useEffect, useState } from 'react'
import Category from '../../data/category'
import { Grid, Typography } from '@mui/material'
import config from '../../config/config'
import HomeLayout from '../../components/layout/HomeLayout'
import CategoryCard from '../../components/common/CategoryCard'

export const CategoryPage = (): JSX.Element => {
  const [categories, setCategories] = useState<Array<Category>>(() => [])

  useEffect(() => {
    fetch(`${config.API_HOST_NAME}/api/category/`)
      .then((r) => {
        return r.json() as Promise<Array<Category>>
      })
      .then((data) => {
        //console.log(data)
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
    <HomeLayout>
      <Grid
        container
        marginTop={2}
        marginBottom={4}
        spacing={4}
        justifyContent='between'
      >
        {categories.map((category) => (
          <>
            <Grid item xs={12}>
              <Typography variant='h5' color='text.primary' key={category.id}>
                {category.title}
              </Typography>
            </Grid>

            {category.otherCategories?.map((subCat) => (
              <Grid item xs={6} md={4} lg={3} key={subCat.title}>
                <CategoryCard category={subCat} />
              </Grid>
            ))}
          </>
        ))}
      </Grid>
    </HomeLayout>
  )
}
