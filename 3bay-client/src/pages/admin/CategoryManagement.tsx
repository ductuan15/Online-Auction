import * as React from 'react'
import { useCallback } from 'react'
import { Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CategoryTree from '../../components/admin/category/CategoryTree'
import { CreateCategoryDialog } from '../../components/admin/category/CreateCategoryDialog'
import { EditCategoryDialog } from '../../components/admin/category/EditCategoryDialog'
import { useCategoryContext } from '../../contexts/layout/CategoryContext'
import useTitle from '../../hooks/use-title'
import BorderButton from '../../components/common/button/BorderButton'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'

const titleStyle: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.down('sm')]: {
    typography: 'h5',
  },
  typography: 'h3',
})

const CategoryManagement = (): JSX.Element => {
  useTitle('3bay | Manage categories')
  const { dispatch } = useCategoryContext()

  const openDialog = useCallback(() => {
    dispatch({ type: 'OPEN_CREATE_DIALOG', payload: true })
  }, [dispatch])

  return (
    <>
      <Grid
        container
        marginTop={1}
        marginBottom={2}
        spacing={4}
        justifyContent='between'
      >
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          item
          component={Grid}
          xs={12}
        >
          <Typography color='text.primary' sx={titleStyle}>
            <CategoryRoundedIcon fontSize='large' sx={{ mr: 2 }} />
            Manage Categories
          </Typography>

          <BorderButton onClick={openDialog}>
            <AddRoundedIcon color='inherit' />
            Create
          </BorderButton>
        </Stack>

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
