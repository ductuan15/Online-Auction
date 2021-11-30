import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import * as React from 'react'
import { ChangeEvent, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import { Alert, CardMedia, Grid, LinearProgress } from '@mui/material'
import TextField from '@mui/material/TextField'
import ParentCategoryChooser from './ParentCategoryChooser'
import Button from '@mui/material/Button'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import DialogActions from '@mui/material/DialogActions'
import Category from '../../../data/category'

const Input = styled('input')({
  display: 'none',
})

const Label = styled('label')({})

type BaseCategoryDialogProps = {
  allCategories?: Array<Category>
  category?: Category
  open: boolean
  title: string
  dialogName: string
  onCloseCallback: () => void
  extraComponent?: () => JSX.Element
}

export function BaseCategoryDialog(props: BaseCategoryDialogProps) {
  const { open, onCloseCallback, dialogName, title, allCategories, extraComponent, category } = props
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const progressRef = useRef<HTMLDivElement>(null)

  const onClose = () => {
    setImage(null)
    if (progressRef.current && progressRef.current.style) {
      progressRef.current.style.display = 'none'
    }

    onCloseCallback()
  }

  const onSave = () => {
    if (progressRef.current && progressRef.current.style) {
      progressRef.current.style.display = 'block'
    }
  }
  const [image, setImage] = useState<string | null>(null)

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]))
    }
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} aria-labelledby={dialogName}>
      <DialogTitle id={dialogName}>{title}</DialogTitle>

      <DialogContent>
        <Box ref={progressRef} sx={{ width: '100%', display: 'none' }}>
          <LinearProgress />
        </Box>

        <TextField
          autoFocus
          margin="dense"
          id="category-name"
          label="Category name"
          fullWidth
          variant="outlined"
          color="secondary"
          value={category ? category.title : ''}
          sx={{ mt: 2, mb: 2 }}
        />

        <ParentCategoryChooser allCategories={allCategories} currentCategory={category} />

        <Grid
          container
          display="flex"
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item width={1}>
            <Label htmlFor="contained-button-file">
              <Input accept="image/jpeg" id="contained-button-file" type="file" onChange={onImageChange} />

              <Button
                sx={{ width: 1 }}
                startIcon={<ImageOutlinedIcon />}
                variant="contained"
                component="span"
              >
                Choose thumbnail
              </Button>
            </Label>
          </Grid>

          {image && (
            <Grid item>
              <CardMedia component="img" sx={{ width: 128 }} image={image} alt="Category thumbnail" />
            </Grid>
          )}

          {image && (
            <Grid item>
              <Alert severity="info">The image will be resized to 1024x1024 pixels</Alert>
            </Grid>
          )}
        </Grid>

        {extraComponent && extraComponent()}
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave} autoFocus>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
