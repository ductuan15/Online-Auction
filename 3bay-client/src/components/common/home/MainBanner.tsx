import * as React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import BorderButton from '../button/BorderButton'

interface BannerProps {
  description: string
  image: string
  imageText: string
  linkText: string
  title: string
  url: string
}

const MainBanner = (props: BannerProps): JSX.Element => {
  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${props.image})`,
      }}
    >
      {/* Increase the priority of the hero background image */}
      {
        <img
          style={{ display: 'none' }}
          src={props.image}
          alt={props.imageText}
        />
      }
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.4)',
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography
              component='h1'
              variant='h3'
              color='inherit'
              gutterBottom
            >
              {props.title}
            </Typography>
            <Typography
              variant='h5'
              color='inherit'
              paragraph
              sx={{ whiteSpace: 'pre-line' }}
            >
              {props.description}
            </Typography>

            <Link
              to={props.url}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <BorderButton
                unSelectedColour='white'
                unSelectedBorderColour='white'
                color='inherit'
              >
                {props.linkText}
              </BorderButton>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
export default MainBanner
