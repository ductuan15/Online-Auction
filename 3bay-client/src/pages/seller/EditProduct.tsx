import * as React from 'react'
import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import {
  Alert,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
} from '@mui/material'
import {useNavigate, useParams} from 'react-router-dom'
import {getProductById, updateProductById} from '../../services/product.service'
import { useUserContext } from '../../contexts/user/UserContext'
import Error404 from '../common/error/Error404'
import Product, { EditProductFormInput } from '../../models/product'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import WYSIWYGEditor from '../../components/common/editor/WYSIWYGEditor'
import Button from '@mui/material/Button'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import {useIsMounted} from '../../hooks'
import {setErrorTextMsg} from '../../utils/error'

export default function EditProduct(): JSX.Element {
  const [errorText, setErrorText] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | undefined>(undefined)

  const {
    control,
    handleSubmit,
  } = useForm<EditProductFormInput>({
    mode: 'all',
  })

  const { id } = useParams()
  const {
    state: { userDetails },
  } = useUserContext()

  const isMounted = useIsMounted()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        if (id && +id) {
          const response = await getProductById(+id)
          // console.log(response.data)
          setProduct(response.data)
          return
        }
        setProduct(undefined)
      } catch (e) {
        setProduct(undefined)
      }
    })()
  }, [id])

  const submitHandler: SubmitHandler<EditProductFormInput> = async (data) => {
    try {

      setErrorText(null)
      setLoading(true)
      if (product) {
        await updateProductById(product?.id, data)
        navigate(`/product/${product.id}`)
      }
    } catch (e) {
      setErrorTextMsg(e, setErrorText)
    } finally {
      if (isMounted()) {
        setLoading(false)
      }
    }
  }

  // console.log(userDetails?.uuid)

  return product && product.sellerId === userDetails?.uuid ? (
    <Container maxWidth='lg' sx={{ my: 2 }}>
      <Typography
        color='text.primary'
        fontWeight={600}
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            typography: 'h4',
          },
          typography: 'h3',
        })}
        gutterBottom
      >
        📦 Edit 「{product.name}」
      </Typography>

      {errorText && <Alert severity='error'>{errorText}</Alert>}

      <Container
        component={Paper}
        variant='outlined'
        sx={{
          p: 2,
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          my: 2,
        }}
      >
        <Grid container maxWidth='md'>
          <Grid
            container
            component='form'
            noValidate
            maxWidth='md'
            rowSpacing={2}
            onSubmit={handleSubmit(submitHandler)}
          >
            <Grid item xs={12} mt={2}>
              <Grid item xs={12}>
                <Typography color='text.primary' variant='h6'>
                  Add description
                </Typography>
              </Grid>

              <Controller
                control={control}
                name='description'
                defaultValue={''}
                render={({ field }) => (
                  <WYSIWYGEditor
                    // value={field.value}
                    onChange={field.onChange}
                    editorStyle={{
                      minHeight: 256,
                      paddingLeft: 15,
                      paddingRight: 15,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid container item xs={12} justifyContent='flex-end'>
              <Button
                variant='contained'
                type='submit'
                size='large'
                startIcon={<SaveOutlinedIcon />}
              >
                Save changes
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {isLoading && <LinearProgress variant='indeterminate' />}
    </Container>
  ) : (
    <Error404 />
  )
}
