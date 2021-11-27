import React from 'react'
import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import EmailSubscriber from './EmailSubscriber'
import IconButton from '@mui/material/IconButton'
import RedditIcon from '@mui/icons-material/Reddit'
import GitHubIcon from '@mui/icons-material/GitHub'
import { AppName } from './AppName'

const footerLinks = [
  {
    title: 'Buy',
    links: ['Registration', 'Stores', 'Bidding & bidding helps'],
  },
  { title: 'Sell', links: ['Start selling', 'Learn to sell', 'Affiliates'] },
  { title: 'About 3bay', links: ['Our info', 'News', 'Careers', 'Policies'] },
  { title: 'Help & Contact', links: ['Contact us'] },
]

function renderLinks() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gridAutoColumns: '1fr',
        gap: 4,
      }}
    >
      {footerLinks.map((column) => {
        return (
          <Box
            sx={{ display: 'flex', flexDirection: 'column' }}
            key={column.title}
          >
            <Typography fontWeight="bold" variant="body2">
              {column.title}
            </Typography>

            {column.links.map((links) => {
              return (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  key={links}
                  sx={{ mt: 1.5 }}
                >
                  {links}
                </Typography>
              )
            })}
          </Box>
        )
      })}
    </Box>
  )
}

export default function AppFooter() {
  return (
    <Container component="footer">
      <Divider />
      <Box
        sx={{
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
              color: 'primary.main',
              textDecoration: 'underline',
            },
          },
        }}
      >
        <div>
          <AppName bigSize />
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.5 }}>
            Subscribe to our letters! Please UwU
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No spam, only cats.
          </Typography>
          <EmailSubscriber />
        </div>

        {renderLinks()}
      </Box>

      <Divider />

      <Box
        sx={{
          py: 4,
          display: { xs: 'block', sm: 'flex' },
          alignItems: { sm: 'center' },
          justifyContent: { sm: 'space-between' },
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Copyright © {new Date().getFullYear()} HCMUS.
        </Typography>
        <Box sx={{ py: { xs: 2, sm: 0 } }}>
          <Stack spacing={2} direction="row">
            <IconButton
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/"
              aria-label="github"
              title="GitHub"
              size="small"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.reddit.com/r/cats/"
              aria-label="github"
              title="GitHub"
              size="small"
            >
              <RedditIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}
