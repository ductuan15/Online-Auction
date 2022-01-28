import * as React from 'react'
import { CSSProperties, useMemo } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import BorderButton from '../button/BorderButton'
import { SxProps } from '@mui/system'

type BannerProps = {
  description: string
  image: string
  imageText: string
  linkText: string
  title: string
  url: string
}

const bannerBoxContainer: SxProps = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: 'rgba(0,0,0,.4)',
}

const bannerBox: SxProps = {
  position: 'relative',
  p: { xs: 3, md: 6 },
  pr: { md: 0 },
}

const noneUnderlineLink: CSSProperties = {
  textDecoration: 'none',
  color: 'inherit',
}

const MainBanner = (props: BannerProps): JSX.Element => {
  const bannerContainer: SxProps = useMemo(() => {
    return {
      position: 'relative',
      backgroundColor: 'grey.800',
      color: '#fff',
      mb: 4,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url(${props.image})`,
    }
  }, [props.image])

  return (
    <Paper sx={bannerContainer}>
      {/* Increase the priority of the hero background image */}
      {
        <img
          style={{ display: 'none' }}
          src={props.image}
          alt={props.imageText}
        />
      }

      <Box sx={bannerBoxContainer} />

      <Grid container>
        <Grid item md={6}>
          <Box sx={bannerBox}>
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

            <Link to={props.url} style={noneUnderlineLink}>
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
