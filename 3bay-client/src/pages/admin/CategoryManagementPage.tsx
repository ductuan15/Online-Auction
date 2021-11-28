import * as React from 'react'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import Button from '@mui/material/Button'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import CustomizedTreeView from '../../components/admin/category/CategoryTree'

const testData = [
  {
    id: 1,
    title: 'Electronics',
    parent_id: null,
    thumbnails: {
      sm: 'http://192.168.1.12:3030/api/images/category/1?type=sm',
      md: 'http://192.168.1.12:3030/api/images/category/1?type=md',
      lg: 'http://192.168.1.12:3030/api/images/category/1?type=lg',
      original: 'http://192.168.1.12:3030/api/images/category/1',
    },
    categories: [
      {
        id: 2,
        title: 'Laptops & PC',
        parent_id: 1,
        thumbnails: {
          sm: 'http://192.168.1.12:3030/api/images/category/2?type=sm',
          md: 'http://192.168.1.12:3030/api/images/category/2?type=md',
          lg: 'http://192.168.1.12:3030/api/images/category/2?type=lg',
          original: 'http://192.168.1.12:3030/api/images/category/2',
        },
      },
      {
        id: 3,
        title: 'Laptops',
        parent_id: 1,
        thumbnails: {
          sm: 'http://192.168.1.12:3030/api/images/category/3?type=sm',
          md: 'http://192.168.1.12:3030/api/images/category/3?type=md',
          lg: 'http://192.168.1.12:3030/api/images/category/3?type=lg',
          original: 'http://192.168.1.12:3030/api/images/category/3',
        },
      },
      {
        id: 4,
        title: 'PC',
        parent_id: 1,
        thumbnails: {
          sm: 'http://192.168.1.12:3030/api/images/category/4?type=sm',
          md: 'http://192.168.1.12:3030/api/images/category/4?type=md',
          lg: 'http://192.168.1.12:3030/api/images/category/4?type=lg',
          original: 'http://192.168.1.12:3030/api/images/category/4',
        },
      },
      {
        id: 5,
        title: 'Cameras & photo',
        parent_id: 1,
        thumbnails: {
          sm: 'http://192.168.1.12:3030/api/images/category/5?type=sm',
          md: 'http://192.168.1.12:3030/api/images/category/5?type=md',
          lg: 'http://192.168.1.12:3030/api/images/category/5?type=lg',
          original: 'http://192.168.1.12:3030/api/images/category/5',
        },
      },
    ],
  },
]

export const CategoryManagementPage = () => {
  return (
    <Grid
      container
      marginTop={4}
      marginBottom={4}
      spacing={4}
      justifyContent="between"
    >
      <Grid display="flex" xs={12} item alignItems="center">
        <Typography variant="h3" color="text.primary">
          <CategoryRoundedIcon fontSize="large" sx={{ mr: 2 }} />
          Manage Categories
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Grid justifyContent="flex-end" alignItems="center">
          <Button startIcon={<AddRoundedIcon />} variant="contained">
            Create
          </Button>
        </Grid>
      </Grid>

      <Grid mt={2} display="flex" item xs={12} justifyContent="center">
        <CustomizedTreeView />
      </Grid>
    </Grid>
  )
}
