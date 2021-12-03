import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import * as React from 'react'
import { ChangeEvent, SyntheticEvent, useRef, useState } from 'react'
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
import axios, {AxiosPromise} from 'axios'

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
  submitData: (formData: FormData, category: Category | undefined) => AxiosPromise
  extraComponent?: () => JSX.Element
}

export function BaseCategoryDialog(props: BaseCategoryDialogProps): JSX.Element {
  const { open, onCloseCallback, dialogName, title, allCategories, extraComponent, category, submitData } =
    props
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

  // TODO: refactor me -.-
  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    if (progressRef.current && progressRef.current.style) {
      progressRef.current.style.display = 'block'
    }

    const target = e.target as typeof e.target & {
      categoryTitle: { value: string }
      parentId: { value: string }
    }

    const title = target.categoryTitle.value
    let parentId = 'null'
    if (+target.parentId.value > 0) {
      parentId = target.parentId.value
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('parentId', parentId)

    try {
      if (image != null) {
        const blobResponse = await axios.get(image, { responseType: 'blob' })
        formData.append('thumbnail', blobResponse.data)
      }

      await submitData(formData, category)
      onClose()
    } catch (e) {
      console.log(e)
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
        <form
          id={`category-form-${dialogName}`}
          onSubmit={onSubmit}
          encType="multipart/form-data"
          method="post"
        >
          <Box ref={progressRef} sx={{ width: '100%', display: 'none' }}>
            <LinearProgress />
          </Box>

          <TextField
            autoFocus
            margin="dense"
            id={`category-name-${dialogName}`}
            label="Category name"
            name="categoryTitle"
            fullWidth
            variant="outlined"
            color="secondary"
            defaultValue={category ? category.title : ''}
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

            {!image && category?.thumbnails && (
              <Grid item>
                <CardMedia
                  component="img"
                  sx={{ width: 128 }}
                  image={category.thumbnails.sm}
                  alt="Category thumbnail"
                />
              </Grid>
            )}

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
        </form>
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button autoFocus type="submit" form={`category-form-${dialogName}`}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
