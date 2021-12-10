import * as React from 'react'
import { FC, useEffect } from 'react'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import Button from '@mui/material/Button'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import CategoryTree from '../../components/admin/category/CategoryTree'
import { CreateCategoryDialog } from '../../components/admin/category/CreateCategoryDialog'
import config from '../../config/config'
import Category from '../../data/category'
import { EditCategoryDialog } from '../../components/admin/category/EditCategoryDialog'
import {
  CategoryProvider,
  useCategoryContext,
} from '../../contexts/admin/CategoryContext'
import Layout from '../../components/layout/Layout'

export const CategoryManagement: FC = () => {
  return (
    <Layout>
      <CategoryProvider>
        <CategoryManagementContent />
      </CategoryProvider>
    </Layout>
  )
}

const CategoryManagementContent: FC = () => {
  const { addAllCategories, dispatch } = useCategoryContext()

  useEffect(() => {
    fetch(`${config.apiHostName}/api/category/`)
      .then((r) => {
        return r.json() as Promise<Array<Category>>
      })
      .then((data) => {
        console.log(data)
        if (data) {
          addAllCategories(data)
        }
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }, [])

  const openDialog = () => {
    dispatch({ type: 'OPEN_CREATE_DIALOG', payload: true })
  }

  return (
    <>
      <Grid container marginBottom={4} spacing={4} justifyContent='between'>
        <Grid display='flex' xs={12} item alignItems='center'>
          <Typography
            color='text.primary'
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                typography: 'h5',
              },
              typography: 'h3',
            })}
          >
            <CategoryRoundedIcon fontSize='large' sx={{ mr: 2 }} />
            Manage Categories
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Grid justifyContent='flex-end' alignItems='center'>
            <Button
              onClick={openDialog}
              startIcon={<AddRoundedIcon />}
              variant='contained'
            >
              Create
            </Button>
          </Grid>
        </Grid>

        <Grid mt={2} display='flex' item xs={12} justifyContent='center'>
          <CategoryTree />
        </Grid>
      </Grid>

      <CreateCategoryDialog />

      <EditCategoryDialog />
    </>
  )
}
