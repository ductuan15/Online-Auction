import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Box, CardActionArea } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { SxProps } from '@mui/system'

interface Props {
  title: string
  link: string
  img: string
}

const boxStyle: SxProps = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '100%',
  width: '100%',
  bgcolor: 'rgba(0, 0, 0, 0.54)',
  color: 'white',
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
}

const titleStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  width: '100%',
  transform: 'translateY(-50%)',
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
}

export default function AdminMenuCard({
  title,
  link,
  img,
}: Props): JSX.Element {
  const [elevation, setElevation] = useState(0)
  const [scale, setScale] = useState(1.0)

  const cardMediaStyle: SxProps = useMemo(
    () => ({
      transition: `transform .4s`,
      transform: `scale(${scale})`,
    }),
    [scale],
  )

  const onMouseOver = useCallback(() => {
    setElevation(8)
    setScale(1.25)
  }, [])

  const onMouseOut = useCallback(() => {
    setElevation(0)
    setScale(1.0)
  }, [])

  return (
    <Card
      elevation={elevation}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      sx={{ borderRadius: 4 }}
    >
      <CardActionArea component={RouterLink} to={link}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            height='240'
            component='img'
            image={img}
            alt={title}
            sx={cardMediaStyle}
          />

          <Box sx={boxStyle}>
            <Typography
              sx={titleStyle}
              textAlign='center'
              variant='h4'
              component='h3'
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  )
}
