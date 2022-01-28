import React from 'react'
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material'
import EmailSubscriber from './EmailSubscriber'
import IconButton from '@mui/material/IconButton'
import RedditIcon from '@mui/icons-material/Reddit'
import GitHubIcon from '@mui/icons-material/GitHub'
import AppName from '../appname/AppName'
import { SxProps } from '@mui/system'

const footerLinks = [
  {
    title: 'Buy',
    links: ['Registration', 'Stores', 'Bidding & bidding helps'],
  },
  { title: 'Sell', links: ['Start selling', 'Learn to sell', 'Affiliates'] },
  { title: 'About 3bay', links: ['Our info', 'News', 'Careers', 'Policies'] },
  { title: 'Help & Contact', links: ['Contact us'] },
]

const footerStyle: SxProps = {
  bgcolor: 'background.paper',
}

const footerBoxContainer: SxProps = {
  py: 8,
  display: 'grid',
  gridAutoColumns: '1fr',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 4,
  gridTemplateColumns: {
    xs: '1fr',
    sm: '1fr',
    md: '1fr 1.75fr',
    lg: '1fr 1fr',
  },
  gridTemplateRows: 'auto',
  '& a:not(.MuiIconButton-root)': {
    mt: 1,
    color: 'text.secondary',
    typography: 'body2',
    '&:hover': {
      color: 'text.primary',
    },
  },
}

const bottomFooterContainer: SxProps = {
  py: 4,
  display: { xs: 'block', sm: 'flex' },
  alignItems: { sm: 'center' },
  justifyContent: { sm: 'space-between' },
}

const footerLinkContainer: SxProps = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
  gridAutoColumns: '1fr',
  gap: 4,
}

const footerLinkInnerContainer: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  color: 'text.primary',
}

function FooterLinks(): JSX.Element {
  return (
    <Box sx={footerLinkContainer}>
      {footerLinks.map((column) => {
        return (
          <Box sx={footerLinkInnerContainer} key={column.title}>
            <Typography fontWeight='bold' variant='body2'>
              {column.title}
            </Typography>

            {column.links.map((links) => {
              return (
                <Link
                  underline='none'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://youtu.be/dQw4w9WgXcQ'
                  variant='body2'
                  color='text.secondary'
                  sx={{ mt: 1.5 }}
                  key={links}
                >
                  {links}
                </Link>
              )
            })}
          </Box>
        )
      })}
    </Box>
  )
}

export default function AppFooter(): JSX.Element {
  return (
    <Container component='footer' sx={footerStyle}>
      <Divider />
      <Box sx={footerBoxContainer}>
        <div>
          <AppName bigSize />
          <Typography
            variant='subtitle2'
            color='text.primary'
            fontWeight='bold'
            sx={{ mt: 1.5 }}
          >
            Subscribe to our letters! Please UwU
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            No spam, only cats.
          </Typography>
          <EmailSubscriber />
        </div>

        <FooterLinks />
      </Box>

      <Divider />

      <Box sx={bottomFooterContainer}>
        <Typography color='text.secondary' variant='body2'>
          Copyright © {new Date().getFullYear()} HCMUS.
        </Typography>
        <Box sx={{ py: { xs: 2, sm: 0 } }}>
          <Stack spacing={2} direction='row'>
            <IconButton
              target='_blank'
              rel='noopener noreferrer'
              href='https://github.com/ductuan15/Online-Auction'
              aria-label='github'
              title='GitHub'
              size='small'
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.reddit.com/r/cats/'
              aria-label='github'
              title='Reddit'
              size='small'
            >
              <RedditIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}
