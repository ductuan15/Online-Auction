import * as React from 'react'
import { ChangeEvent, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Category from '../../../data/category'
import TextField from '@mui/material/TextField'
import ParentCategoryChooser from './ParentCategoryChooser'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { Alert, CardMedia, Grid, LinearProgress } from '@mui/material'
import Box from '@mui/material/Box'

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

type CreateCategoryDialogProps = {
  allCategories?: Array<Category>
  open: boolean
  onCloseCallback: () => void
}

export function CreateCategoryDialog(props: CreateCategoryDialogProps) {
  return (
    <BaseCategoryDialog
      open={props.open}
      onCloseCallback={props.onCloseCallback}
      title={'Create new category'}
      dialogName={'category-create-dialog'}
      allCategories={props.allCategories}
    />
  )
}

function BaseCategoryDialog(props: BaseCategoryDialogProps) {
  const {
    open,
    onCloseCallback,
    dialogName,
    title,
    allCategories,
    extraComponent,
  } = props
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
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby={dialogName}
    >
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
          sx={{ mt: 2, mb: 2 }}
        />

        <ParentCategoryChooser allCategories={allCategories} />

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
              <Input
                accept="image/jpeg"
                id="contained-button-file"
                type="file"
                onChange={onImageChange}
              />

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
              <CardMedia
                component="img"
                sx={{ width: 128 }}
                image={image}
                alt="Category thumbnail"
              />
            </Grid>
          )}

          {image && (
            <Grid item>
              <Alert severity="info">
                The image will be resized to 1024x1024 pixels
              </Alert>
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
