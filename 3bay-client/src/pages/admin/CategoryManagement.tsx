import * as React from 'react'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import Button from '@mui/material/Button'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import CategoryTree from '../../components/admin/category/CategoryTree'
import { CreateCategoryDialog } from '../../components/admin/category/CreateCategoryDialog'
import { EditCategoryDialog } from '../../components/admin/category/EditCategoryDialog'
import { useCategoryContext } from '../../contexts/admin/CategoryContext'

const CategoryManagement = (): JSX.Element => {
  const { dispatch } = useCategoryContext()

  const openDialog = () => {
    dispatch({ type: 'OPEN_CREATE_DIALOG', payload: true })
  }

  return (
    <>
      <Grid
        container
        marginTop={1}
        marginBottom={4}
        spacing={4}
        justifyContent='between'
      >
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

        <Grid display='flex' item xs={12} justifyContent='center'>
          <CategoryTree />
        </Grid>
      </Grid>

      <CreateCategoryDialog />

      <EditCategoryDialog />
    </>
  )
}

export default CategoryManagement
