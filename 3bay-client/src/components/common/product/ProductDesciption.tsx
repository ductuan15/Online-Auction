import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  Paper,
  Typography,
} from '@mui/material'
import moment from 'moment'
import { Link as RouterLink } from 'react-router-dom'
import DOMPurify from 'dompurify'

import { styled } from '@mui/material/styles'
import { useUserContext } from '../../../contexts/user/UserContext'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import { useIsAuctionClosed } from '../../../hooks/use-is-auction-closed'

const StyledDiv = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  span: {
    backgroundColor: 'inherit !important',
    color: 'inherit !important',
  },
  // p: {
  //   margin: '4px 0px',
  // }
}))

const ProductDescription = (): JSX.Element | null => {
  const {
    state: { userDetails },
  } = useUserContext()

  const {
    state: { currentProduct: product, latestAuction },
  } = useProductContext()

  const isAuctionClosed = useIsAuctionClosed(latestAuction)

  return product ? (
    <Paper
      elevation={0}
      component={Grid}
      container
      item
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

        {product.sellerId === userDetails?.uuid && !isAuctionClosed && (
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

      {product.productDescriptionHistory.map(function (des) {
        return (
          <Grid item container xs={12} key={des.id} mt={2}>
            <Grid item xs={12}>
              <Typography variant='body1' color='text.primary'>
                ✏️ {moment(des.createdAt).format('L')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <StyledDiv
                style={{
                  wordWrap: 'break-word',
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(des.description),
                }}
              />
            </Grid>
          </Grid>
        )
      })}
    </Paper>
  ) : null
}
export default ProductDescription