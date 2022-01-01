import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  Paper,
  Typography,
} from '@mui/material'
import Product from '../../../models/product'
import moment from 'moment'
import { Link as RouterLink } from 'react-router-dom'
import DOMPurify from 'dompurify'

import { styled } from '@mui/material/styles'
import { useUserContext } from '../../../contexts/user/UserContext'

const StyledDiv = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  span: {
    backgroundColor: 'inherit !important',
    color: 'inherit !important',
  },
}))

type ProductDescriptionProps = {
  product: Product
}

const ProductDescription = ({
  product,
}: ProductDescriptionProps): JSX.Element => {
  const {
    state: { userDetails },
  } = useUserContext()

  return (
    <Paper
      elevation={0}
      component={Grid}
      container
      variant='outlined'
      flexDirection='row'
      xs={12}
      p={2}
      px={3}
    >
      <Grid item container xs={12} flexDirection='row'>
        <Typography gutterBottom variant='h4' component='h5'>
          📦 About the product
        </Typography>

        <Box flexGrow={1} />

        {product.sellerId === userDetails?.uuid && (
          <Link
            component={RouterLink}
            to={`/product/${product?.id}/edit`}
            underline='none'
            color='inherit'
          >
            <Button>✏️ Add more description</Button>
          </Link>
        )}
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      {product
        ? product.productDescriptionHistory.map(function (des) {
            return (
              <Grid item xs={12} key={des.id} mt={2} flexDirection='column'>
                <Typography variant='body1' color='text.primary'>
                  ✏️ {moment(des.createdAt).format('L')}
                </Typography>

                <StyledDiv
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(des.description),
                  }}
                />
              </Grid>
            )
          })
        : null}
    </Paper>
  )
}
export default ProductDescription