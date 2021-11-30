import * as React from 'react'
import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import Button from '@mui/material/Button'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import CategoryTree from '../../components/admin/category/CategoryTree'
import { CreateCategoryDialog } from '../../components/admin/category/CategoryCRUDDialog'
import config from '../../config/config'
import Category from '../../data/category'

export const CategoryManagementPage = () => {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Array<Category>>(() => [])

  useEffect(() => {
    fetch(`${config.apiHostName}/api/category/`)
      .then((r) => {
        return r.json() as Promise<Array<Category>>
      })
      .then((data) => {
        console.log(data)
        if (data) {
          const categories = data.map((obj: Category) => {
            return new Category(obj)
          })
          setCategories(categories)
        }
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }, [])

  const onDialogCloseCallback = () => {
    setOpen(false)
  }
  const openDialog = () => {
    setOpen(true)
  }

  return (
    <div>
      <Grid
        container
        marginTop={1}
        marginBottom={4}
        spacing={4}
        justifyContent="between"
      >
        <Grid display="flex" xs={12} item alignItems="center">
          <Typography
            color="text.primary"
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                typography: 'h5',
              },
              typography: 'h3',
            })}
          >
            <CategoryRoundedIcon fontSize="large" sx={{ mr: 2 }} />
            Manage Categories
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Grid justifyContent="flex-end" alignItems="center">
            <Button
              onClick={openDialog}
              startIcon={<AddRoundedIcon />}
              variant="contained"
            >
              Create
            </Button>
          </Grid>
        </Grid>

        <Grid mt={2} display="flex" item xs={12} justifyContent="center">
          <CategoryTree categories={categories} />
        </Grid>
      </Grid>

      <CreateCategoryDialog
        open={open}
        onCloseCallback={onDialogCloseCallback}
        allCategories={categories}
      />
    </div>
  )
}
